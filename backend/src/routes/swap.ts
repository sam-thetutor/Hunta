import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import soroswapService from '../services/soroswap.js';
import Swap from '../models/Swap.js';
import ManagedWallet from '../models/ManagedWallet.js';

const router = Router();

// Get available tokens
router.get('/tokens', async (req: AuthenticatedRequest, res) => {
  try {
    const tokens = await soroswapService.getTokens();
    res.json({ success: true, tokens });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

// Get available protocols
router.get('/protocols', async (req: AuthenticatedRequest, res) => {
  try {
    const protocols = await soroswapService.getProtocols();
    res.json({ success: true, protocols });
  } catch (error) {
    console.error('Error fetching protocols:', error);
    res.status(500).json({ error: 'Failed to fetch protocols' });
  }
});

// Get pools
router.get('/pools', async (req: AuthenticatedRequest, res) => {
  try {
    const { protocols } = req.query;
    const protocolList = protocols ? (Array.isArray(protocols) ? protocols : [protocols]) : undefined;
    const pools = await soroswapService.getPools(protocolList as string[]);
    res.json({ success: true, pools });
  } catch (error) {
    console.error('Error fetching pools:', error);
    res.status(500).json({ error: 'Failed to fetch pools' });
  }
});

// Get contract addresses
router.get('/contracts', async (req: AuthenticatedRequest, res) => {
  try {
    const contracts = await soroswapService.getContractAddresses();
    res.json({ success: true, contracts });
  } catch (error) {
    console.error('Error fetching contract addresses:', error);
    res.status(500).json({ error: 'Failed to fetch contract addresses' });
  }
});

// Get swap quote
router.post('/quote', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { inputToken, outputToken, inputAmount, slippageTolerance = 0.5 } = req.body;

    if (!inputToken || !outputToken || !inputAmount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const quote = await soroswapService.getQuote(
      inputToken,
      outputToken,
      inputAmount,
      slippageTolerance
    );

    res.json({ success: true, quote });
  } catch (error) {
    console.error('Error getting quote:', error);
    res.status(500).json({ error: 'Failed to get quote' });
  }
});

// Execute swap
router.post('/execute', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { inputToken, outputToken, inputAmount, slippageTolerance = 0.5 } = req.body;

    if (!inputToken || !outputToken || !inputAmount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get user's managed wallet
    const managedWallet = await ManagedWallet.findOne({ userId: req.user?.id });
    if (!managedWallet) {
      return res.status(404).json({ error: 'Managed wallet not found' });
    }

    // Get quote first
    const quote = await soroswapService.getQuote(
      inputToken,
      outputToken,
      inputAmount,
      slippageTolerance
    );

    // Execute swap
    const swapRequest = {
      inputToken,
      outputToken,
      inputAmount,
      slippageTolerance,
      recipient: managedWallet.publicKey
    };

    const swapResponse = await soroswapService.executeSwap(swapRequest);

    // Save swap to database
    const swap = new Swap({
      userId: req.user?.id,
      managedWalletId: managedWallet._id,
      hash: swapResponse.hash,
      status: swapResponse.status,
      inputToken: quote.inputToken,
      outputToken: quote.outputToken,
      inputAmount: quote.inputAmount,
      outputAmount: quote.outputAmount,
      priceImpact: quote.priceImpact,
      fee: quote.fee,
      slippageTolerance,
      route: quote.route
    });

    await swap.save();

    res.json({
      success: true,
      swap: {
        id: swap._id,
        hash: swap.hash,
        status: swap.status,
        inputToken: swap.inputToken,
        outputToken: swap.outputToken,
        inputAmount: swap.inputAmount,
        outputAmount: swap.outputAmount,
        priceImpact: swap.priceImpact,
        fee: swap.fee,
        createdAt: swap.createdAt
      }
    });

  } catch (error) {
    console.error('Error executing swap:', error);
    res.status(500).json({ error: 'Failed to execute swap' });
  }
});

// Send signed transaction
router.post('/send', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { signedXdr, launchtube = false } = req.body;

    if (!signedXdr) {
      return res.status(400).json({ error: 'Signed XDR is required' });
    }

    const result = await soroswapService.sendTransaction(signedXdr, launchtube);

    res.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Error sending transaction:', error);
    res.status(500).json({ error: 'Failed to send transaction' });
  }
});

// Get swap status
router.get('/status/:hash', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { hash } = req.params;

    // Get swap from database
    const swap = await Swap.findOne({ hash, userId: req.user?.id });
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Get latest status from Soroswap
    const status = await soroswapService.getSwapStatus(hash);

    // Update database if status changed
    if (status.status !== swap.status) {
      swap.status = status.status;
      if (status.status === 'completed') {
        swap.completedAt = new Date();
      }
      if (status.error) {
        swap.error = status.error;
      }
      await swap.save();
    }

    res.json({
      success: true,
      swap: {
        id: swap._id,
        hash: swap.hash,
        status: swap.status,
        inputToken: swap.inputToken,
        outputToken: swap.outputToken,
        inputAmount: swap.inputAmount,
        outputAmount: swap.outputAmount,
        priceImpact: swap.priceImpact,
        fee: swap.fee,
        error: swap.error,
        createdAt: swap.createdAt,
        completedAt: swap.completedAt
      }
    });

  } catch (error) {
    console.error('Error getting swap status:', error);
    res.status(500).json({ error: 'Failed to get swap status' });
  }
});

// Get user's swap history
router.get('/history', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const swaps = await Swap.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Swap.countDocuments({ userId: req.user?.id });

    res.json({
      success: true,
      swaps: swaps.map(swap => ({
        id: swap._id,
        hash: swap.hash,
        status: swap.status,
        inputToken: swap.inputToken,
        outputToken: swap.outputToken,
        inputAmount: swap.inputAmount,
        outputAmount: swap.outputAmount,
        priceImpact: swap.priceImpact,
        fee: swap.fee,
        error: swap.error,
        createdAt: swap.createdAt,
        completedAt: swap.completedAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting swap history:', error);
    res.status(500).json({ error: 'Failed to get swap history' });
  }
});

// Get token price
router.get('/price/:tokenAddress', async (req: AuthenticatedRequest, res) => {
  try {
    const { tokenAddress } = req.params;
    const price = await soroswapService.getTokenPrice(tokenAddress);
    res.json({ success: true, price });
  } catch (error) {
    console.error('Error getting token price:', error);
    res.status(500).json({ error: 'Failed to get token price' });
  }
});

export default router; 