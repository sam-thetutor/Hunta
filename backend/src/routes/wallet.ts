import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import ManagedWallet from '../models/ManagedWallet.js';
import { getWalletBalance } from '../utils/stellar.js';

const router = Router();

// Get managed wallet balance
router.get('/balance', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const managedWallet = await ManagedWallet.findOne({ userId: req.user?.id });
    
    if (!managedWallet) {
      return res.status(404).json({ error: 'Managed wallet not found' });
    }

    const balances = await getWalletBalance(managedWallet.publicKey);

    res.json({
      wallet: {
        id: managedWallet._id,
        publicKey: managedWallet.publicKey,
        walletName: managedWallet.walletName,
        walletType: managedWallet.walletType,
        createdAt: managedWallet.createdAt
      },
      balances
    });

  } catch (error) {
    console.error('Error getting wallet balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get wallet info
router.get('/info', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const managedWallet = await ManagedWallet.findOne({ userId: req.user?.id });
    
    if (!managedWallet) {
      return res.status(404).json({ error: 'Managed wallet not found' });
    }

    res.json({
      wallet: {
        id: managedWallet._id,
        publicKey: managedWallet.publicKey,
        walletName: managedWallet.walletName,
        walletType: managedWallet.walletType,
        createdAt: managedWallet.createdAt,
        lastUsed: managedWallet.lastUsed
      }
    });

  } catch (error) {
    console.error('Error getting wallet info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 