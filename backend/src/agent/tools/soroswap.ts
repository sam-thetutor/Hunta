import { Tool } from '@langchain/core/tools';
import soroswapService from '../../services/soroswap.js';

// Tool to get available tokens
export class GetTokensTool extends Tool {
  name = 'get_tokens';
  description = 'Get list of available tokens for swapping on Soroswap';

  async _call(): Promise<string> {
    try {
      const tokens = await soroswapService.getTokens();
      return JSON.stringify({ success: true, tokens }, null, 2);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return JSON.stringify({ success: false, error: errorMessage }, null, 2);
    }
  }
}

// Tool to get available protocols
export class GetProtocolsTool extends Tool {
  name = 'get_protocols';
  description = 'Get list of available protocols (Soroswap, Aqua, Phoenix, etc.)';

  async _call(): Promise<string> {
    try {
      const protocols = await soroswapService.getProtocols();
      return JSON.stringify({ success: true, protocols }, null, 2);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return JSON.stringify({ success: false, error: errorMessage }, null, 2);
    }
  }
}

// Tool to get pools
export class GetPoolsTool extends Tool {
  name = 'get_pools';
  description = 'Get pools for specific protocols. Input should be a JSON string with protocols array.';

  async _call(input: string): Promise<string> {
    try {
      const { protocols } = JSON.parse(input);
      const pools = await soroswapService.getPools(protocols);
      return JSON.stringify({ success: true, pools }, null, 2);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return JSON.stringify({ success: false, error: errorMessage }, null, 2);
    }
  }
}

// Tool to get contract addresses
export class GetContractAddressesTool extends Tool {
  name = 'get_contract_addresses';
  description = 'Get Soroswap contract addresses (factory, router, aggregator)';

  async _call(): Promise<string> {
    try {
      const contracts = await soroswapService.getContractAddresses();
      return JSON.stringify({ success: true, contracts }, null, 2);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return JSON.stringify({ success: false, error: errorMessage }, null, 2);
    }
  }
}

// Tool to get swap quote
export class GetQuoteTool extends Tool {
  name = 'get_quote';
  description = 'Get a quote for swapping tokens. Input should be a JSON string with inputToken, outputToken, inputAmount, and optional slippageTolerance.';

  async _call(input: string): Promise<string> {
    try {
      const { inputToken, outputToken, inputAmount, slippageTolerance = 0.5 } = JSON.parse(input);
      
      if (!inputToken || !outputToken || !inputAmount) {
        return JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters: inputToken, outputToken, inputAmount' 
        }, null, 2);
      }

      const quote = await soroswapService.getQuote(
        inputToken,
        outputToken,
        inputAmount,
        slippageTolerance
      );

      return JSON.stringify({ success: true, quote }, null, 2);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return JSON.stringify({ success: false, error: errorMessage }, null, 2);
    }
  }
}

// Tool to execute swap
export class ExecuteSwapTool extends Tool {
  name = 'execute_swap';
  description = 'Execute a token swap. Input should be a JSON string with inputToken, outputToken, inputAmount, and optional slippageTolerance.';

  async _call(input: string): Promise<string> {
    try {
      const { inputToken, outputToken, inputAmount, slippageTolerance = 0.5 } = JSON.parse(input);
      
      if (!inputToken || !outputToken || !inputAmount) {
        return JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters: inputToken, outputToken, inputAmount' 
        }, null, 2);
      }

      const swapRequest = {
        inputToken,
        outputToken,
        inputAmount,
        slippageTolerance,
        recipient: 'USER_WALLET_ADDRESS' // This would be replaced with actual user wallet
      };

      const swapResponse = await soroswapService.executeSwap(swapRequest);

      return JSON.stringify({ success: true, swap: swapResponse }, null, 2);
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message }, null, 2);
    }
  }
}

// Tool to send signed transaction
export class SendTransactionTool extends Tool {
  name = 'send_transaction';
  description = 'Send a signed transaction to the network. Input should be a JSON string with signedXdr and optional launchtube boolean.';

  async _call(input: string): Promise<string> {
    try {
      const { signedXdr, launchtube = false } = JSON.parse(input);
      
      if (!signedXdr) {
        return JSON.stringify({ 
          success: false, 
          error: 'Missing required parameter: signedXdr' 
        }, null, 2);
      }

      const result = await soroswapService.sendTransaction(signedXdr, launchtube);

      return JSON.stringify({ success: true, result }, null, 2);
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message }, null, 2);
    }
  }
}

// Tool to get swap status
export class GetSwapStatusTool extends Tool {
  name = 'get_swap_status';
  description = 'Get the status of a swap transaction. Input should be the transaction hash.';

  async _call(hash: string): Promise<string> {
    try {
      if (!hash) {
        return JSON.stringify({ 
          success: false, 
          error: 'Transaction hash is required' 
        }, null, 2);
      }

      const status = await soroswapService.getSwapStatus(hash);
      return JSON.stringify({ success: true, status }, null, 2);
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message }, null, 2);
    }
  }
}

// Tool to get swap history
export class GetSwapHistoryTool extends Tool {
  name = 'get_swap_history';
  description = 'Get swap history for a user. Input should be the user wallet address.';

  async _call(userAddress: string): Promise<string> {
    try {
      if (!userAddress) {
        return JSON.stringify({ 
          success: false, 
          error: 'User address is required' 
        }, null, 2);
      }

      const history = await soroswapService.getSwapHistory(userAddress);
      return JSON.stringify({ success: true, history }, null, 2);
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message }, null, 2);
    }
  }
}

// Tool to get token price
export class GetTokenPriceTool extends Tool {
  name = 'get_token_price';
  description = 'Get the current price of a token. Input should be the token contract address.';

  async _call(tokenAddress: string): Promise<string> {
    try {
      if (!tokenAddress) {
        return JSON.stringify({ 
          success: false, 
          error: 'Token address is required' 
        }, null, 2);
      }

      const price = await soroswapService.getTokenPrice(tokenAddress);
      return JSON.stringify({ success: true, price }, null, 2);
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message }, null, 2);
    }
  }
} 