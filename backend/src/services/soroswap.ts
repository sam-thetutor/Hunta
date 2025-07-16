import dotenv from 'dotenv';
import { 
  SoroswapSDK, 
  SupportedNetworks, 
  SupportedProtocols, 
  SupportedAssetLists,
  TradeType,
  QuoteRequest,
  BuildQuoteRequest,
  Pool,
  PriceData,
  AssetList
} from '@soroswap/sdk';

dotenv.config();

const SOROSWAP_API_KEY = process.env.SOROSWAP_API_KEY;

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface SwapQuote {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  priceImpact: string;
  fee: string;
  route: any[];
  validUntil: number;
  xdr?: string; // Transaction XDR for signing
}

export interface SwapRequest {
  inputToken: string;
  outputToken: string;
  inputAmount: string;
  slippageTolerance: number;
  recipient: string;
}

export interface SwapResponse {
  hash: string;
  status: 'pending' | 'completed' | 'failed';
  inputToken: string;
  outputToken: string;
  inputAmount: string;
  outputAmount: string;
  timestamp: number;
}

export interface SwapStatus {
  hash: string;
  status: 'pending' | 'completed' | 'failed';
  inputToken: string;
  outputToken: string;
  inputAmount: string;
  outputAmount: string;
  timestamp: number;
  error?: string;
}

class SoroswapService {
  private sdk: SoroswapSDK;
  private network: SupportedNetworks;

  constructor() {
    if (!SOROSWAP_API_KEY) {
      throw new Error('SOROSWAP_API_KEY is required');
    }

    this.network = process.env.NODE_ENV === 'production' 
      ? SupportedNetworks.MAINNET 
      : SupportedNetworks.TESTNET;

    this.sdk = new SoroswapSDK({
      apiKey: SOROSWAP_API_KEY,
      defaultNetwork: this.network,
      timeout: 30000
    });
  }

  // Get list of available tokens from asset lists
  async getTokens(): Promise<Token[]> {
    try {
      // Get Soroswap asset list
      const assetLists = await this.sdk.getAssetList(SupportedAssetLists.SOROSWAP);
      
      if (Array.isArray(assetLists) && assetLists.length > 0) {
        const soroswapAssets = assetLists[0] as AssetList;
        return soroswapAssets.assets.map(asset => ({
          address: asset.contract || '',
          symbol: asset.code || 'UNKNOWN',
          name: asset.name || asset.code || 'Unknown Token',
          decimals: asset.decimals || 7,
          logoURI: asset.icon
        }));
      }

      // Fallback: return common tokens
      return [
        {
          address: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 7,
          logoURI: 'https://stellar.expert/explorer/public/asset/CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA'
        },
        {
          address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
          symbol: 'XLM',
          name: 'Stellar Lumens',
          decimals: 7,
          logoURI: 'https://stellar.expert/explorer/public/asset/XLM'
        },
        {
          address: 'CCXQWO33QBEUDVTWDDOYLD2SYEJSWUM6DIJUX6NDAOSXNCGK3PSIWQJG',
          symbol: 'AQUA',
          name: 'Aqua',
          decimals: 7,
          logoURI: 'https://stellar.expert/explorer/public/asset/CCXQWO33QBEUDVTWDDOYLD2SYEJSWUM6DIJUX6NDAOSXNCGK3PSIWQJG'
        }
      ];
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  }

  // Get swap quote using SDK
  async getQuote(
    inputToken: string,
    outputToken: string,
    inputAmount: string,
    slippageTolerance: number = 0.5
  ): Promise<SwapQuote> {
    try {
      // Convert amount to BigInt (assuming 7 decimals for Stellar tokens)
      const amountBigInt = BigInt(Math.floor(parseFloat(inputAmount) * 10000000));

      const quoteRequest: QuoteRequest = {
        assetIn: inputToken,
        assetOut: outputToken,
        amount: amountBigInt,
        tradeType: TradeType.EXACT_IN,
        protocols: [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA, SupportedProtocols.PHOENIX],
        assetList: [SupportedAssetLists.SOROSWAP],
        slippageBps: Math.floor(slippageTolerance * 100), // Convert percentage to basis points
        maxHops: 3
      };

      const quote = await this.sdk.quote(quoteRequest, this.network);

      // Build transaction XDR
      const buildRequest: BuildQuoteRequest = {
        quote: quote,
        from: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // Placeholder, will be replaced with actual wallet
      };

      const buildResponse = await this.sdk.build(buildRequest, this.network);

      // Get token info for response
      const tokens = await this.getTokens();
      const inputTokenInfo = tokens.find(t => t.address === inputToken) || {
        address: inputToken,
        symbol: 'UNKNOWN',
        name: 'Unknown Token',
        decimals: 7
      };
      const outputTokenInfo = tokens.find(t => t.address === outputToken) || {
        address: outputToken,
        symbol: 'UNKNOWN',
        name: 'Unknown Token',
        decimals: 7
      };

      return {
        inputToken: inputTokenInfo,
        outputToken: outputTokenInfo,
        inputAmount: inputAmount,
        outputAmount: (Number(quote.amountOut) / 10000000).toString(),
        priceImpact: quote.priceImpactPct,
        fee: '0.5', // Default fee
        route: quote.routePlan.map(route => ({
          protocol: route.swapInfo.protocol,
          path: route.swapInfo.path,
          percentage: route.percent
        })),
        validUntil: Date.now() + 300000, // 5 minutes
        xdr: buildResponse.xdr
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      throw error;
    }
  }

  // Execute swap using SDK
  async executeSwap(swapRequest: SwapRequest): Promise<SwapResponse> {
    try {
      // Get quote first
      const quote = await this.getQuote(
        swapRequest.inputToken,
        swapRequest.outputToken,
        swapRequest.inputAmount,
        swapRequest.slippageTolerance
      );

      if (!quote.xdr) {
        throw new Error('No transaction XDR available from quote');
      }

      // Note: In a real implementation, you would:
      // 1. Sign the XDR with the user's wallet
      // 2. Send the signed transaction
      // For now, we'll simulate the process

      // Simulate transaction submission
      const mockHash = '0x' + Math.random().toString(16).substr(2, 8) + Date.now().toString(16);
      
      return {
        hash: mockHash,
        status: 'pending',
        inputToken: swapRequest.inputToken,
        outputToken: swapRequest.outputToken,
        inputAmount: swapRequest.inputAmount,
        outputAmount: quote.outputAmount,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error executing swap:', error);
      throw error;
    }
  }

  // Send signed transaction
  async sendTransaction(signedXdr: string, launchtube: boolean = false): Promise<any> {
    try {
      const result = await this.sdk.send(signedXdr, launchtube, this.network);
      return result;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  // Get swap status (this would need to be implemented based on your tracking system)
  async getSwapStatus(hash: string): Promise<SwapStatus> {
    try {
      // In a real implementation, you would query the blockchain or your database
      // For now, return a mock status
      return {
        hash,
        status: 'completed',
        inputToken: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
        outputToken: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
        inputAmount: '100',
        outputAmount: '95.5',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error getting swap status:', error);
      throw error;
    }
  }

  // Get token price using SDK
  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      const prices = await this.sdk.getPrice([tokenAddress], this.network);
      
      if (prices.length > 0 && prices[0].price !== null) {
        return prices[0].price;
      }
      
      return 0;
    } catch (error) {
      console.error('Error getting token price:', error);
      throw error;
    }
  }

  // Get user's swap history (this would come from your database)
  async getSwapHistory(userAddress: string): Promise<SwapStatus[]> {
    try {
      // This would typically query your database
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error getting swap history:', error);
      throw error;
    }
  }

  // Get available protocols
  async getProtocols(): Promise<string[]> {
    try {
      return await this.sdk.getProtocols(this.network);
    } catch (error) {
      console.error('Error getting protocols:', error);
      throw error;
    }
  }

  // Get pools for specific protocols
  async getPools(protocols: string[] = [SupportedProtocols.SOROSWAP]): Promise<Pool[]> {
    try {
      return await this.sdk.getPools(this.network, protocols, [SupportedAssetLists.SOROSWAP]);
    } catch (error) {
      console.error('Error getting pools:', error);
      throw error;
    }
  }

  // Get contract addresses
  async getContractAddresses() {
    try {
      const [factory, router, aggregator] = await Promise.all([
        this.sdk.getContractAddress(this.network, 'factory'),
        this.sdk.getContractAddress(this.network, 'router'),
        this.sdk.getContractAddress(this.network, 'aggregator')
      ]);

      return {
        factory: factory.address,
        router: router.address,
        aggregator: aggregator.address
      };
    } catch (error) {
      console.error('Error getting contract addresses:', error);
      throw error;
    }
  }
}

export default new SoroswapService(); 