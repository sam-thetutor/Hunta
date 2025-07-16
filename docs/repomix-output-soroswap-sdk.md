This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
examples/
  frontend-widget/
    README.md
    swap-widget.html
  backend-example.js
src/
  clients/
    http-client.ts
  types/
    assets.ts
    common.ts
    index.ts
    pools.ts
    price.ts
    quote.ts
    send.ts
  index.ts
  soroswap-sdk.ts
tests/
  integration/
    quote.integration.test.ts
    README.md
    setup.ts
  http-client.test.ts
  quote.test.ts
  setup.ts
  soroswap-sdk.test.ts
.gitignore
CLAUDE.md
eslint.config.js
jest.config.js
jest.integration.config.js
package.json
README.md
tsconfig.json
```

# Files

## File: examples/frontend-widget/README.md
````markdown
# Frontend Widget Architecture

This directory contains an example of how to create a secure frontend widget that integrates with the server-side Soroswap SDK.

## 🔐 Security Architecture

The widget follows a secure architecture where:

1. **Frontend Widget**: Handles UI/UX and user interactions
2. **Backend API**: Uses the Soroswap SDK for sensitive operations
3. **Clear Separation**: No sensitive data (credentials, tokens) exposed to frontend

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend       │    │  Your Backend   │    │  Soroswap API   │
│  Widget         │◄──►│  (SDK)          │◄──►│                 │
│                 │    │                 │    │                 │
│ • UI/UX         │    │ • Authentication│    │ • Quotes        │
│ • User Input    │    │ • SDK Calls     │    │ • Transactions  │
│ • Wallet Conn.  │    │ • Token Mgmt    │    │ • Pool Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Implementation

### Backend Setup

Create API endpoints that use the Soroswap SDK:

```typescript
// server.ts
import express from 'express';
import { SoroswapSDK } from 'soroswap-sdk';

const app = express();
const sdk = new SoroswapSDK({
  email: process.env.SOROSWAP_EMAIL!,
  password: process.env.SOROSWAP_PASSWORD!
});

app.post('/api/quote', async (req, res) => {
  try {
    const quote = await sdk.quote(req.body);
    // Only return necessary data to frontend
    res.json({
      trade: quote.trade,
      priceImpact: quote.priceImpact,
      xdr: quote.xdr // Safe to send XDR to frontend for signing
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/send', async (req, res) => {
  try {
    const { signedXdr, network } = req.body;
    const result = await sdk.send(signedXdr, 100, network);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend Integration

The frontend widget handles:

1. **User Interface**: Token selection, amount input, network switching
2. **Quote Requests**: Calls backend API for quotes
3. **Wallet Integration**: Signs transactions locally
4. **Transaction Submission**: Sends signed XDR to backend

### Key Features

- **Network Selection**: Switch between mainnet/testnet
- **Token Swapping**: Intuitive token swap interface
- **Real-time Quotes**: Live quote updates
- **Price Impact Display**: Shows slippage and routing info
- **Error Handling**: User-friendly error messages
- **Loading States**: Clear loading indicators

### Security Benefits

✅ **Credentials Protected**: Never exposed to frontend
✅ **Token Management**: Handled server-side only  
✅ **API Rate Limiting**: Controlled by your backend
✅ **User Validation**: Can add custom validation logic
✅ **Audit Trail**: Server-side logging of all operations

## 🛠️ Customization

You can customize the widget by:

1. **Styling**: Modify CSS to match your brand
2. **Token Lists**: Add/remove supported tokens
3. **Features**: Add slippage settings, advanced options
4. **Integrations**: Connect to different wallet providers
5. **Analytics**: Add tracking and monitoring

## 📱 Mobile Responsive

The widget is designed to be responsive and works well on:
- Desktop browsers
- Mobile web browsers  
- WebView components
- PWA applications

## 🔗 Integration Examples

### React Integration

```jsx
// SwapWidget.jsx
import React, { useState } from 'react';

const SwapWidget = () => {
  const [quote, setQuote] = useState(null);
  
  const getQuote = async (params) => {
    const response = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const quoteData = await response.json();
    setQuote(quoteData);
  };
  
  // ... rest of component
};
```

### Vue.js Integration

```vue
<!-- SwapWidget.vue -->
<template>
  <div class="swap-widget">
    <!-- Widget UI -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      quote: null,
      loading: false
    }
  },
  methods: {
    async getQuote(params) {
      this.loading = true;
      try {
        const response = await this.$http.post('/api/quote', params);
        this.quote = response.data;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
```

## 🚀 Deployment

1. Deploy your backend with the Soroswap SDK
2. Host the frontend widget (static files)
3. Configure CORS for cross-origin requests
4. Set up environment variables for credentials
5. Monitor and log API usage

This architecture ensures security while providing a smooth user experience!
````

## File: examples/frontend-widget/swap-widget.html
````html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soroswap Widget Demo</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .widget-container {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }

        .header {
            text-align: center;
            margin-bottom: 24px;
        }

        .logo {
            width: 40px;
            height: 40px;
            background: #667eea;
            border-radius: 50%;
            display: inline-block;
            margin-bottom: 8px;
        }

        h1 {
            margin: 0;
            font-size: 24px;
            color: #1a1a1a;
            font-weight: 600;
        }

        .subtitle {
            color: #666;
            font-size: 14px;
            margin-top: 4px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }

        select, input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        select:focus, input:focus {
            outline: none;
            border-color: #667eea;
        }

        .token-input {
            display: flex;
            align-items: center;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            padding: 4px;
            transition: border-color 0.2s;
        }

        .token-input:focus-within {
            border-color: #667eea;
        }

        .token-select {
            border: none;
            background: #f8f9fa;
            border-radius: 6px;
            padding: 8px 12px;
            margin-right: 8px;
            font-weight: 500;
            min-width: 80px;
        }

        .amount-input {
            border: none;
            flex: 1;
            padding: 8px;
            font-size: 16px;
        }

        .swap-direction {
            text-align: center;
            margin: 16px 0;
        }

        .swap-button {
            background: #f8f9fa;
            border: 1px solid #e1e5e9;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .swap-button:hover {
            background: #e9ecef;
            transform: rotate(180deg);
        }

        .quote-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            display: none;
        }

        .quote-info.show {
            display: block;
        }

        .quote-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .quote-row:last-child {
            margin-bottom: 0;
        }

        .quote-label {
            color: #666;
        }

        .quote-value {
            font-weight: 500;
            color: #333;
        }

        .action-button {
            width: 100%;
            padding: 16px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            margin-top: 16px;
        }

        .action-button:hover:not(:disabled) {
            background: #5a6fd8;
        }

        .action-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .loading {
            opacity: 0.7;
            pointer-events: none;
        }

        .error {
            color: #dc3545;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 12px;
            margin: 16px 0;
            font-size: 14px;
        }

        .success {
            color: #155724;
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 6px;
            padding: 12px;
            margin: 16px 0;
            font-size: 14px;
        }

        .network-selector {
            text-align: center;
            margin-bottom: 16px;
        }

        .network-toggle {
            display: inline-flex;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 4px;
        }

        .network-option {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }

        .network-option.active {
            background: #667eea;
            color: white;
        }
    </style>
</head>
<body>
    <div class="widget-container">
        <div class="header">
            <div class="logo"></div>
            <h1>Soroswap</h1>
            <div class="subtitle">Swap tokens on Stellar</div>
        </div>

        <div class="network-selector">
            <div class="network-toggle">
                <button class="network-option active" onclick="switchNetwork('mainnet')">Mainnet</button>
                <button class="network-option" onclick="switchNetwork('testnet')">Testnet</button>
            </div>
        </div>

        <form id="swapForm">
            <div class="form-group">
                <label>You Pay</label>
                <div class="token-input">
                    <select class="token-select" id="tokenIn">
                        <option value="CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA">USDC</option>
                        <option value="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC">XLM</option>
                        <option value="CCXQWO33QBEUDVTWDDOYLD2SYEJSWUM6DIJUX6NDAOSXNCGK3PSIWQJG">AQUA</option>
                    </select>
                    <input type="number" class="amount-input" id="amountIn" placeholder="0.0" step="any">
                </div>
            </div>

            <div class="swap-direction">
                <button type="button" class="swap-button" onclick="swapTokens()">
                    ↓
                </button>
            </div>

            <div class="form-group">
                <label>You Receive</label>
                <div class="token-input">
                    <select class="token-select" id="tokenOut">
                        <option value="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC">XLM</option>
                        <option value="CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA">USDC</option>
                        <option value="CCXQWO33QBEUDVTWDDOYLD2SYEJSWUM6DIJUX6NDAOSXNCGK3PSIWQJG">AQUA</option>
                    </select>
                    <input type="number" class="amount-input" id="amountOut" placeholder="0.0" readonly>
                </div>
            </div>

            <div class="quote-info" id="quoteInfo">
                <div class="quote-row">
                    <span class="quote-label">Expected Output:</span>
                    <span class="quote-value" id="expectedOutput">-</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">Price Impact:</span>
                    <span class="quote-value" id="priceImpact">-</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">Route:</span>
                    <span class="quote-value" id="route">-</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">Fee:</span>
                    <span class="quote-value" id="fee">0.5%</span>
                </div>
            </div>

            <div id="errorMessage" class="error" style="display: none;"></div>
            <div id="successMessage" class="success" style="display: none;"></div>

            <button type="button" class="action-button" id="getQuoteBtn" onclick="getQuote()">
                Get Quote
            </button>
            
            <button type="button" class="action-button" id="swapBtn" onclick="executeSwap()" style="display: none;">
                Execute Swap
            </button>
        </form>
    </div>

    <script>
        let currentNetwork = 'mainnet';
        let currentQuote = null;

        // Mock backend API calls (in real implementation, these would call your server)
        async function callBackendAPI(endpoint, data = null) {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (endpoint === '/api/quote') {
                // Mock quote response
                return {
                    trade: {
                        expectedAmountOut: (parseFloat(data.amount) * 0.998).toFixed(6),
                        amountOutMin: (parseFloat(data.amount) * 0.995).toFixed(6)
                    },
                    priceImpact: { numerator: '25', denominator: '10000' },
                    xdr: 'MOCK_TRANSACTION_XDR_' + Date.now()
                };
            } else if (endpoint === '/api/send') {
                // Mock send response
                return {
                    hash: '0x' + Math.random().toString(16).substr(2, 8),
                    status: 'success'
                };
            }
        }

        function switchNetwork(network) {
            currentNetwork = network;
            document.querySelectorAll('.network-option').forEach(btn => {
                btn.classList.toggle('active', btn.textContent.toLowerCase() === network);
            });
        }

        function swapTokens() {
            const tokenIn = document.getElementById('tokenIn');
            const tokenOut = document.getElementById('tokenOut');
            const amountIn = document.getElementById('amountIn');
            const amountOut = document.getElementById('amountOut');

            // Swap the values
            const tempToken = tokenIn.value;
            tokenIn.value = tokenOut.value;
            tokenOut.value = tempToken;

            const tempAmount = amountIn.value;
            amountIn.value = amountOut.value;
            amountOut.value = tempAmount;

            // Clear quote
            hideQuote();
        }

        async function getQuote() {
            const amountIn = document.getElementById('amountIn').value;
            const tokenIn = document.getElementById('tokenIn').value;
            const tokenOut = document.getElementById('tokenOut').value;

            if (!amountIn || parseFloat(amountIn) <= 0) {
                showError('Please enter a valid amount');
                return;
            }

            if (tokenIn === tokenOut) {
                showError('Please select different tokens');
                return;
            }

            try {
                showLoading(true);
                hideMessages();

                // Call backend API for quote (keeping sensitive data server-side)
                const quoteData = {
                    assetIn: tokenIn,
                    assetOut: tokenOut,
                    amount: (parseFloat(amountIn) * 1000000).toString(), // Convert to stroops
                    tradeType: 'EXACT_IN',
                    protocols: ['soroswap', 'aqua'],
                    network: currentNetwork
                };

                currentQuote = await callBackendAPI('/api/quote', quoteData);
                
                // Update UI with quote data
                updateQuoteDisplay(currentQuote);
                showQuote();
                
                document.getElementById('getQuoteBtn').style.display = 'none';
                document.getElementById('swapBtn').style.display = 'block';

            } catch (error) {
                showError('Failed to get quote: ' + error.message);
            } finally {
                showLoading(false);
            }
        }

        async function executeSwap() {
            if (!currentQuote) {
                showError('No quote available');
                return;
            }

            try {
                showLoading(true);
                hideMessages();

                // In a real implementation, you would:
                // 1. Connect to user's wallet
                // 2. Sign the transaction XDR from the quote
                // 3. Send the signed transaction to your backend

                // Simulate wallet signing
                await new Promise(resolve => setTimeout(resolve, 2000));
                const signedXdr = 'SIGNED_' + currentQuote.xdr;

                // Send signed transaction through backend
                const result = await callBackendAPI('/api/send', { 
                    xdr: signedXdr,
                    network: currentNetwork 
                });

                showSuccess(`Swap successful! Transaction: ${result.hash.substring(0, 10)}...`);
                
                // Reset form
                resetForm();

            } catch (error) {
                showError('Swap failed: ' + error.message);
            } finally {
                showLoading(false);
            }
        }

        function updateQuoteDisplay(quote) {
            const expectedOutput = (parseFloat(quote.trade.expectedAmountOut) / 1000000).toFixed(6);
            const priceImpact = (parseFloat(quote.priceImpact.numerator) / parseFloat(quote.priceImpact.denominator) * 100).toFixed(2);
            
            document.getElementById('expectedOutput').textContent = expectedOutput;
            document.getElementById('priceImpact').textContent = priceImpact + '%';
            document.getElementById('route').textContent = 'Soroswap → Aqua';
            document.getElementById('amountOut').value = expectedOutput;
        }

        function showQuote() {
            document.getElementById('quoteInfo').classList.add('show');
        }

        function hideQuote() {
            document.getElementById('quoteInfo').classList.remove('show');
            document.getElementById('getQuoteBtn').style.display = 'block';
            document.getElementById('swapBtn').style.display = 'none';
            currentQuote = null;
        }

        function showLoading(isLoading) {
            document.querySelector('.widget-container').classList.toggle('loading', isLoading);
        }

        function showError(message) {
            const errorEl = document.getElementById('errorMessage');
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }

        function showSuccess(message) {
            const successEl = document.getElementById('successMessage');
            successEl.textContent = message;
            successEl.style.display = 'block';
        }

        function hideMessages() {
            document.getElementById('errorMessage').style.display = 'none';
            document.getElementById('successMessage').style.display = 'none';
        }

        function resetForm() {
            document.getElementById('amountIn').value = '';
            document.getElementById('amountOut').value = '';
            hideQuote();
            hideMessages();
        }

        // Auto-hide messages after 5 seconds
        setInterval(() => {
            if (document.getElementById('successMessage').style.display === 'block') {
                setTimeout(hideMessages, 5000);
            }
        }, 1000);

        // Add real-time quote updates
        document.getElementById('amountIn').addEventListener('input', () => {
            if (currentQuote) {
                hideQuote();
            }
        });
    </script>
</body>
</html>
````

## File: examples/backend-example.js
````javascript
/**
 * Soroswap SDK Backend Example
 * 
 * This example demonstrates how to use the Soroswap SDK
 * in a Node.js backend environment with API key authentication.
 */

const { SoroswapSDK, SupportedNetworks, SupportedProtocols, TradeType } = require('@soroswap/sdk');

async function main() {
  // Initialize the SDK with your API key
  const sdk = new SoroswapSDK({
    apiKey: process.env.SOROSWAP_API_KEY || 'sk_your_api_key_here',
    baseUrl: process.env.SOROSWAP_API_URL, // Optional: 'http://localhost:3000' for local dev
    defaultNetwork: SupportedNetworks.MAINNET,
    timeout: 30000 // 30 seconds timeout
  });

  // Common baseUrl examples:
  // - Production: 'https://api.soroswap.finance' (default)

  try {
    console.log('🚀 Soroswap SDK Example');
    console.log('========================');

    // 1. Get available protocols
    console.log('\n1. Getting available protocols...');
    const protocols = await sdk.getProtocols(SupportedNetworks.MAINNET);
    console.log('Available protocols:', protocols);

    // 2. Get contract addresses
    console.log('\n2. Getting contract addresses...');
    const factoryAddress = await sdk.getContractAddress(SupportedNetworks.MAINNET, 'factory');
    const routerAddress = await sdk.getContractAddress(SupportedNetworks.MAINNET, 'router');
    console.log('Factory address:', factoryAddress.address);
    console.log('Router address:', routerAddress.address);

    // 3. Get a quote for a token swap
    console.log('\n3. Getting quote for USDC -> EURC...');
    const USDC = 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75';
    const EURC = 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV';

    const quoteRequest = {
      assetIn: USDC,
      assetOut: EURC,
      amount: 1000000000n, // 100 USDC (7 decimals)
      tradeType: TradeType.EXACT_IN,
      protocols: [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA],
      slippageBps: '50', // 0.5%
    };

    const quote = await sdk.quote(quoteRequest);
    console.log('Quote received:');
    console.log('- Asset In:', quote.assetIn);
    console.log('- Asset Out:', quote.assetOut);
    console.log('- Amount In:', quote.amountIn);
    console.log('- Amount Out:', quote.amountOut);
    console.log('- Trade Type:', quote.tradeType);
    console.log('- Price Impact:', quote.priceImpactPct + '%');
    console.log('- Route Plans:', quote.routePlan.length);

    // 4. Build the transaction from the quote
    console.log('\n4. Building transaction...');
    const buildRequest = {
      quote: quote,
      from: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Your wallet address
      to: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'   // Recipient address (optional)
    };

    const buildResponse = await sdk.build(buildRequest);
    console.log('Transaction built successfully!');
    console.log('XDR length:', buildResponse.xdr.length);

    // 5. At this point, you would:
    //    - Sign the XDR with your wallet/keypair
    //    - Send the signed transaction using sdk.send()
    console.log('\n5. Next steps:');
    console.log('- Sign the XDR with your wallet');
    console.log('- Send signed transaction using sdk.send(signedXdr)');

    // Example of sending (commented out as it requires a signed XDR):
    /*
    const signedXdr = 'YOUR_SIGNED_XDR_HERE';
    const sendResult = await sdk.send(signedXdr, false); // launchtube = false
    console.log('Transaction sent:', sendResult);
    */

    // 6. Get pools information
    console.log('\n6. Getting pools information...');
    const pools = await sdk.getPools(
      SupportedNetworks.MAINNET,
      [SupportedProtocols.SOROSWAP],
      undefined, // No asset list filter
      { limit: 5 } // Get first 5 pools
    );
    console.log(`Found ${pools.length} pools`);
    if (pools.length > 0) {
      console.log('First pool:', {
        protocol: pools[0].protocol,
        tokenA: pools[0].tokenA.substring(0, 10) + '...',
        tokenB: pools[0].tokenB.substring(0, 10) + '...',
        reserveA: pools[0].reserveA,
        reserveB: pools[0].reserveB
      });
    }

    console.log('\n✅ Example completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Handle specific error types
    if (error.statusCode === 401) {
      console.error('Authentication failed - check your API key');
    } else if (error.statusCode === 404) {
      console.error('Resource not found');
    } else if (error.message.includes('route not found')) {
      console.error('No trading route available between these tokens');
    }
  }
}

// Express.js backend integration example
function createExpressEndpoints(app) {
  const sdk = new SoroswapSDK({
    apiKey: process.env.SOROSWAP_API_KEY,
    baseUrl: process.env.SOROSWAP_API_URL, // Optional: for custom API endpoints
    defaultNetwork: SupportedNetworks.MAINNET
  });

  // Endpoint to get a quote and build transaction
  app.post('/api/quote-and-build', async (req, res) => {
    try {
      const { assetIn, assetOut, amount, walletAddress } = req.body;

      // Get quote
      const quote = await sdk.quote({
        assetIn,
        assetOut,
        amount: BigInt(amount),
        tradeType: TradeType.EXACT_IN,
        protocols: [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA]
      });

      // Build transaction
      const buildResponse = await sdk.build({
        quote,
        from: walletAddress
      });

      // Return only necessary data to frontend
      res.json({
        success: true,
        quote: {
          assetIn: quote.assetIn,
          assetOut: quote.assetOut,
          tradeType: quote.tradeType
        },
        xdr: buildResponse.xdr
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Endpoint to send signed transaction
  app.post('/api/send-transaction', async (req, res) => {
    try {
      const { signedXdr, launchtube = false } = req.body;

      const result = await sdk.send(signedXdr, launchtube);

      res.json({
        success: true,
        result
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createExpressEndpoints
};
````

## File: src/clients/http-client.ts
````typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * HTTP client wrapper with API key authentication and error handling
 */
export class HttpClient {
  private client: AxiosInstance;

  constructor(
    baseURL: string,
    apiKey: string,
    timeout: number = 30000
  ) {
    
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      // Add custom transformRequest to handle BigInt serialization
      transformRequest: [
        (data: any) => {
          if (data && typeof data === 'object') {
            return JSON.stringify(data, (_, value) =>
              typeof value === 'bigint' ? value.toString() : value
            );
          }
          return data;
        }
      ],
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        return Promise.reject(this.transformError(error));
      }
    );
  }

  /**
   * Transform axios error to APIError
   */
  private transformError(error: any) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || error.message,
        statusCode: error.response.status,
        timestamp: new Date().toISOString(),
        path: error.response.config?.url,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error: No response received',
        statusCode: 0,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error',
        statusCode: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  /**
   * Build URL with query parameters
   */
  buildUrlWithQuery(baseUrl: string, params: Record<string, any>): string {
    const queryString = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
}
````

## File: src/types/assets.ts
````typescript
export interface AssetInfo {
  code?: string;
  issuer?: string;
  contract?: string;
  name?: string;
  org?: string;
  domain?: string;
  icon?: string;
  decimals?: number;
}

export interface AssetList {
  name: string;
  provider?: string;
  description?: string;
  version?: string;
  feedback?: string;
  network?: string;
  assets: AssetInfo[];
}

export interface AssetListInfo {
  name: string;
  url: string;
}
````

## File: src/types/common.ts
````typescript
// Trade types
export enum TradeType {
  EXACT_IN = 'EXACT_IN',
  EXACT_OUT = 'EXACT_OUT',
}

// Asset list types
export enum SupportedAssetLists {
  SOROSWAP = 'https://raw.githubusercontent.com/soroswap/token-list/main/tokenList.json',
  STELLAR_EXPERT = 'https://api.stellar.expert/explorer/public/asset-list/top50',
  LOBSTR = 'https://lobstr.co/api/v1/sep/assets/curated.json',
  AQUA = 'https://amm-api.aqua.network/tokens/?format=json&pooled=true&size=200',
}

export enum SupportedPlatforms {
  SDEX = 'sdex',
  AGGREGATOR = 'aggregator',
  ROUTER = 'router'
}

export enum SupportedNetworks {
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export enum SupportedProtocols {
  SOROSWAP = 'soroswap',
  PHOENIX = 'phoenix',
  AQUA = 'aqua',
  // COMET = 'comet',
  SDEX = 'sdex',
}

export interface SoroswapSDKConfig {
  apiKey: string;
  baseUrl?: string;
  defaultNetwork?: SupportedNetworks;
  timeout?: number;
}
````

## File: src/types/index.ts
````typescript
export * from './assets';
export * from './common';
export * from './pools';
export * from './price';
export * from './quote';
export * from './send';
````

## File: src/types/pools.ts
````typescript
import { SupportedProtocols } from "./common";

export interface Pool {
  protocol: SupportedProtocols;
  address: string;
  tokenA: string;
  tokenB: string;
  reserveA: bigint;
  reserveB: bigint;
  ledger?: number;
  reserveLp?: bigint;
  stakeAddress?: string;
  poolType?: string;
  fee?: bigint;
  totalFeeBps?: number;
  tokenC?: string;
  reserveC?: bigint;
  futureA?: bigint;
  futureATime?: bigint;
  initialA?: bigint;
  initialATime?: bigint;
  precisionMulA?: bigint;
  precisionMulB?: bigint;
  precisionMulC?: bigint;
  poolHash?: string;

  involvesAsset(asset: string): boolean;
}

export enum LiquidityAction {
  CREATE_POOL = 'create_pool',
  ADD_LIQUIDITY = 'add_liquidity',
  REMOVE_LIQUIDITY = 'remove_liquidity',
}

export interface AddLiquidityRequest {
  assetA: string
  assetB: string
  amountA: bigint
  amountB: bigint
  to: string
  slippageBps?: string
}

export interface LiquidityResponse {
  xdr: string
  type: LiquidityAction
  poolInfo: Pool
  minAmountA: bigint
  minAmountB: bigint
}

export interface RemoveLiquidityRequest {
  assetA: string
  assetB: string
  liquidity: bigint
  amountA: bigint
  amountB: bigint
  to: string
  slippageBps?: string
}

export interface UserPosition {
  poolInfo: Pool
  userPosition: bigint
}
````

## File: src/types/price.ts
````typescript
export interface PriceData {
    asset: string;
    price: number | null;
    timestamp: Date;
}
````

## File: src/types/quote.ts
````typescript
import { SupportedAssetLists, SupportedPlatforms, SupportedProtocols, TradeType } from "./common";

// Quote types
export interface QuoteRequest {
  assetIn: string;
  assetOut: string;
  amount: bigint;
  tradeType: TradeType;
  protocols: SupportedProtocols[];
  parts?: number;
  slippageBps?: number;
  maxHops?: number;
  assetList?: (SupportedAssetLists | string)[];
  feeBps?: number;
  gaslessTrustline?: boolean;
}

export interface BuildQuoteRequest {
  quote: QuoteResponse;
  from?: string;
  to?: string;
  referralId?: string;
}

export interface BuildQuoteResponse {
  xdr: string;
}
export interface DistributionReturn {
  protocol_id: SupportedProtocols
  path: string[]
  parts: number
  is_exact_in: boolean
  poolHashes?: string[]
}

export interface BaseExactInTrade {
  amountIn: bigint
  amountOutMin: bigint
}

export interface ExactInTradeWithPath extends BaseExactInTrade {
  path: string[]
  distribution?: never
}

export interface ExactInTradeWithDistribution extends BaseExactInTrade {
  path?: never
  distribution: DistributionReturn[]
}

export type ExactInTrade = ExactInTradeWithPath | ExactInTradeWithDistribution

export interface BaseExactOutTrade {
  amountOut: bigint
  amountInMax: bigint
}

export interface ExactOutTradeWithPath extends BaseExactOutTrade {
  path: string[]
  distribution?: never
}

export interface ExactOutTradeWithDistribution extends BaseExactOutTrade {
  path?: never
  distribution: DistributionReturn[]
}

export type ExactOutTrade = ExactOutTradeWithPath | ExactOutTradeWithDistribution

export interface HorizonPath {
  asset_type: string
  asset_code: string
  asset_issuer: string
}

export interface HorizonBaseStrictPaths {
  source_asset_type: string
  source_amount: string
  max_source_amount?: string
  source_asset_code?: string
  source_asset_issuer?: string
  destination_asset_type: string
  destination_amount: string
  min_destination_amount?: string
  destination_asset_code?: string
  destination_asset_issuer?: string
  path: HorizonPath[]
}

export interface HorizonTrustlineStrictPaths extends HorizonBaseStrictPaths {
  trustlineOperation: HorizonBaseStrictPaths
  netAmount: string
  otherNetAmountThreshold: string
}

export type HorizonStrictPaths = HorizonBaseStrictPaths | HorizonTrustlineStrictPaths

export interface RoutePlan {
  swapInfo: {
    protocol: SupportedProtocols,
    path: string[],
  }
  percent: string
}

export interface PlatformFee {
  feeBps: number
  feeAmount: bigint
}

export interface TrustlineInfo {
  trustlineCostAssetIn: string
  trustlineCostAssetOut: string
}

interface BaseQuoteResponse {
  assetIn: string
  amountIn: bigint
  assetOut: string
  amountOut: bigint
  otherAmountThreshold: bigint
  priceImpactPct: string
  platform: SupportedPlatforms
  routePlan: RoutePlan[]
  trustlineInfo?: TrustlineInfo
  platformFee?: PlatformFee
  gaslessTrustline?: boolean
}

export interface ExactInQuoteResponse extends BaseQuoteResponse {
  tradeType: TradeType.EXACT_IN
  rawTrade: ExactInTrade | HorizonStrictPaths
}

export interface ExactOutQuoteResponse extends BaseQuoteResponse {
  tradeType: TradeType.EXACT_OUT
  rawTrade: ExactOutTrade | HorizonStrictPaths
}

export type QuoteResponse = ExactInQuoteResponse | ExactOutQuoteResponse
````

## File: src/types/send.ts
````typescript
export interface SendRequest {
  xdr: string;
  launchtube?: boolean;
}
````

## File: src/index.ts
````typescript
// Main SDK class
export { SoroswapSDK } from './soroswap-sdk';

// Export all types for TypeScript users
export * from './types';

// Export utility classes that might be useful
export { HttpClient } from './clients/http-client';

// Default export is the main SDK class
import { SoroswapSDK } from './soroswap-sdk';
export default SoroswapSDK;
````

## File: src/soroswap-sdk.ts
````typescript
import { HttpClient } from './clients/http-client';
import {
  AddLiquidityRequest,
  AssetList,
  AssetListInfo,
  BuildQuoteRequest,
  BuildQuoteResponse,
  LiquidityResponse,
  Pool,
  PriceData,
  QuoteRequest,
  QuoteResponse,
  RemoveLiquidityRequest,
  SoroswapSDKConfig,
  SupportedAssetLists,
  SupportedNetworks,
  UserPosition
} from './types';
import { SendRequest } from './types/send';

/**
 * Main Soroswap SDK class
 * Provides access to all Soroswap API functionality with API key authentication
 */
export class SoroswapSDK {
  private httpClient: HttpClient;
  private defaultNetwork: SupportedNetworks;

  constructor(config: SoroswapSDKConfig) {
    this.defaultNetwork = config.defaultNetwork || SupportedNetworks.MAINNET;
    
    // Initialize HTTP client with API key
    const baseURL = config.baseUrl || 'https://api.soroswap.finance';
    const timeout = config.timeout || 30000;
    
    this.httpClient = new HttpClient(
      baseURL,
      config.apiKey,
      timeout
    );
  }

  /**
   * Transform asset list from enum URLs to simple strings for API
   */
  private transformAssetList(assetList: (SupportedAssetLists | string)[]): string[] {
    return assetList.map(asset => {
      if (typeof asset === 'string') {
        // If it's already a string, check if it's an enum URL
        if (Object.values(SupportedAssetLists).includes(asset as SupportedAssetLists)) {
          // Extract the identifier from the URL
          switch (asset) {
            case SupportedAssetLists.SOROSWAP:
              return 'soroswap';
            case SupportedAssetLists.STELLAR_EXPERT:
              return 'stellar_expert';
            case SupportedAssetLists.LOBSTR:
              return 'lobstr';
            case SupportedAssetLists.AQUA:
              return 'aqua';
            default:
              return asset;
          }
        }
        return asset;
      }
      // If it's an enum, transform to simple string
      switch (asset) {
        case SupportedAssetLists.SOROSWAP:
          return 'soroswap';
        case SupportedAssetLists.STELLAR_EXPERT:
          return 'stellar_expert';
        case SupportedAssetLists.LOBSTR:
          return 'lobstr';
        case SupportedAssetLists.AQUA:
          return 'aqua';
        default:
          return asset as string;
      }
    });
  }

  /**
   * Get contract address for a specific network and contract name
   */
  async getContractAddress(
    network: SupportedNetworks,
    contractName: 'factory' | 'router' | 'aggregator'
  ): Promise<{address: string}> {
    return this.httpClient.get<{address: string}>(`/api/${network}/${contractName}`);
  }

  // ========================================
  // Quote & Trading Methods
  // ========================================

  /**
   * Get available protocols for trading
   */
  async getProtocols(network?: SupportedNetworks): Promise<string[]> {
    const params = { network: network || this.defaultNetwork };
    const url = this.httpClient.buildUrlWithQuery('/protocols', params);
    return this.httpClient.get<string[]>(url);
  }

  /**
   * Get quote for a swap
   */
  async quote(quoteRequest: QuoteRequest, network?: SupportedNetworks): Promise<QuoteResponse> {
    const params = { network: network || this.defaultNetwork };
    const url = this.httpClient.buildUrlWithQuery('/quote', params);
    
    // Transform the request to convert enum URLs to simple strings
    const transformedRequest = { ...quoteRequest };
    if (transformedRequest.assetList) {
      transformedRequest.assetList = this.transformAssetList(transformedRequest.assetList);
    }
    
    return this.httpClient.post<QuoteResponse>(url, transformedRequest);
  }

  /**
   * This builds the quote into an XDR transaction
   */
  async build(buildQuoteRequest: BuildQuoteRequest, network?: SupportedNetworks): Promise<BuildQuoteResponse> {
    const params = { network: network || this.defaultNetwork };
    const url = this.httpClient.buildUrlWithQuery('/quote/build', params);
    return this.httpClient.post<BuildQuoteResponse>(url, buildQuoteRequest);
  }

  /**
   * Send signed transaction
   */
  async send(xdr: string, launchtube: boolean = false, network?: SupportedNetworks): Promise<any> {
    const params = { network: network || this.defaultNetwork };
    const url = this.httpClient.buildUrlWithQuery('/send', params);
    
    const sendData: SendRequest = { xdr, launchtube };
    return this.httpClient.post<any>(url, sendData);
  }

  // ========================================
  // Pool Methods
  // ========================================

  /**
   * Get pools for specific protocols
   */
  async getPools(
    network: SupportedNetworks,
    protocols: string[],
    assetList?: (SupportedAssetLists | string)[]
  ): Promise<Pool[]> {
    const params: any = {
      network,
      protocol: protocols
    };

    if (assetList) {
      params.assetList = this.transformAssetList(assetList);
    }

    const url = this.httpClient.buildUrlWithQuery('/pools', params);
    return this.httpClient.get<Pool[]>(url);
  }

  /**
   * Get pool for specific token pair
   */
  async getPoolByTokens(
    assetA: string,
    assetB: string,
    network: SupportedNetworks,
    protocols: string[]
  ): Promise<Pool[]> {
    const params = {
      network,
      protocol: protocols
    };

    const url = this.httpClient.buildUrlWithQuery(`/pools/${assetA}/${assetB}`, params);
    return this.httpClient.get<Pool[]>(url);
  }

  // ========================================
  // Liquidity Methods
  // ========================================

  /**
   * Add liquidity to a pool
   */
  async addLiquidity(
    liquidityData: AddLiquidityRequest,
    network?: SupportedNetworks
  ): Promise<LiquidityResponse> {
    const params = { network: network || this.defaultNetwork };
    const url = this.httpClient.buildUrlWithQuery('/liquidity/add', params);
    return this.httpClient.post<LiquidityResponse>(url, liquidityData);
  }

  /**
   * Remove liquidity from a pool
   */
  async removeLiquidity(
    liquidityData: RemoveLiquidityRequest,
    network?: SupportedNetworks
  ): Promise<LiquidityResponse> {
    const params = { network: network || this.defaultNetwork };
    const url = this.httpClient.buildUrlWithQuery('/liquidity/remove', params);
    return this.httpClient.post<LiquidityResponse>(url, liquidityData);
  }

  /**
   * Get user liquidity positions
   */
  async getUserPositions(
    address: string,
    network?: SupportedNetworks
  ): Promise<UserPosition[]> {
    const params = { network: network || this.defaultNetwork };
    const url = this.httpClient.buildUrlWithQuery(`/liquidity/positions/${address}`, params);
    return this.httpClient.get<UserPosition[]>(url);
  }

  // ========================================
  // Asset & Price Methods
  // ========================================

  /**
   * Get asset lists metadata or specific asset list
   */
  async getAssetList(name?: SupportedAssetLists): Promise<AssetList[] | AssetListInfo[]> {
    const params = name ? { name } : {};
    const url = this.httpClient.buildUrlWithQuery('/asset-list', params);
    
    if (name) {
      return this.httpClient.get<AssetList[]>(url);
    } else {
      return this.httpClient.get<AssetListInfo[]>(url);
    }
  }

  /**
   * Get asset prices
   */
  async getPrice(
    assets: string | string[],
    network?: SupportedNetworks,
  ): Promise<PriceData[]> {
    const params = {
      network: network || this.defaultNetwork,
      asset: Array.isArray(assets) ? assets : [assets],
    };

    const url = this.httpClient.buildUrlWithQuery('/price', params);
    return this.httpClient.get<PriceData[]>(url);
  }
}
````

## File: tests/integration/quote.integration.test.ts
````typescript
import { SoroswapSDK } from "../../src";
import { QuoteRequest, SupportedAssetLists, SupportedNetworks, SupportedProtocols, TradeType } from "../../src/types";

/**
 * Integration tests for the Soroswap SDK
 * These tests actually call the real API and require valid API key
 *
 * To run these tests:
 * 1. Set environment variable: SOROSWAP_API_KEY
 * 2. Run: pnpm run test:integration
 *
 * Note: These tests may fail if:
 * - API is down
 * - Network issues
 * - Invalid API key
 * - Rate limiting
 */

describe("SoroswapSDK - Integration Tests", () => {
  let sdk: SoroswapSDK;

  // Skip integration tests if API key is not provided
  const skipTests = !process.env.SOROSWAP_API_KEY;

  beforeAll(() => {
    if (skipTests) {
      console.log(
        "⚠️  Skipping integration tests - missing SOROSWAP_API_KEY"
      );
      return;
    }

    sdk = new SoroswapSDK({
      apiKey: process.env.SOROSWAP_API_KEY!,
      baseUrl: process.env.SOROSWAP_API_URL,
      defaultNetwork: SupportedNetworks.MAINNET,
      timeout: 30000,
    });
  });

  describe("API Connection", () => {
    it("should connect to API with valid key", async () => {
      if (skipTests) return;

      // The SDK should work with API key authentication
      const protocols = await sdk.getProtocols(SupportedNetworks.MAINNET);

      expect(Array.isArray(protocols)).toBe(true);
    }, 15000);
  });

  describe("Contract Addresses", () => {
    it("should fetch contract addresses", async () => {
      if (skipTests) return;

      const contracts = ["factory", "router", "aggregator"] as const;

      for (const contractName of contracts) {
        try {
          const contract = await sdk.getContractAddress(
            SupportedNetworks.MAINNET,
            contractName
          );
          expect(contract.address).toBeDefined();
          expect(typeof contract.address).toBe("string");
          expect(contract.address.length).toBeGreaterThan(10);
        } catch (error) {
          // Some contracts might not be available on testnet
          console.log(`Contract ${contractName} not available on testnet`);
        }
      }
    }, 10000);
  });

  describe("Quote", () => {
    it("should get a quote for mainnet tokens", async () => {
      if (skipTests) return;

      const USDC = "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75";
      const EURC = "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV";

      const quoteRequest: QuoteRequest = {
        assetIn: USDC,
        assetOut: EURC,
        amount: 1000000000n, // 1 token (7 decimals)
        tradeType: TradeType.EXACT_IN,
        protocols: [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA, SupportedProtocols.PHOENIX],
        assetList: [SupportedAssetLists.SOROSWAP]
      };

      try {
        const quote = await sdk.quote(quoteRequest);
        
        // Helper function to safely serialize objects with BigInt for logging only
        const serializeBigInt = (obj: any): any => {
          return JSON.parse(JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          ));
        };
        
        console.log("🚀 | it | quote:", serializeBigInt(quote));

        expect(quote).toBeDefined();
        expect(quote.assetIn).toBe(USDC);
        expect(quote.assetOut).toBe(EURC);
        expect(quote.tradeType).toBe("EXACT_IN");
        expect(quote.rawTrade).toBeDefined();
        expect(quote.amountOut).toBeDefined();
        expect(quote.priceImpactPct).toBeDefined();
        expect(Array.isArray(quote.routePlan)).toBe(true);

        console.log("✅ Quote received:", {
          amountOut: quote.amountOut.toString(),
          priceImpact: `${quote.priceImpactPct}%`,
          protocols: quote.routePlan.map((r: any) => r.protocol),
        });
      } catch (error: any) {
        if (
          error.message.includes("route not found") ||
          error.message.includes("insufficient liquidity")
        ) {
          console.log(
            "⚠️  No route found between these tokens (expected on testnet)"
          );
        } else {
          throw error;
        }
      }
    }, 15000);
  });

  describe('Pool Information', () => {
    it('should fetch pools', async () => {
      if (skipTests) return;

      try {
        const pools = await sdk.getPools(SupportedNetworks.MAINNET, [SupportedProtocols.SOROSWAP]);

        expect(Array.isArray(pools)).toBe(true);

        if (pools.length > 0) {
          const firstPool = pools[0];
          expect(firstPool.protocol).toBeDefined();
          expect(firstPool.address).toBeDefined();
          expect(firstPool.tokenA).toBeDefined();
          expect(firstPool.tokenB).toBeDefined();
          expect(firstPool.reserveA).toBeDefined();
          expect(firstPool.reserveB).toBeDefined();
          expect(typeof firstPool.ledger).toBe('number');

          console.log('✅ Found pools:', pools.length);
        } else {
          console.log('⚠️  No pools found on testnet');
        }

      } catch (error: any) {
        if (error.statusCode === 400) {
          console.log('⚠️  Pool query not supported or no pools available');
        } else {
          throw error;
        }
      }
    }, 15000);

    // it('should fetch specific token pair pool', async () => {
    //   if (skipTests) return;

    //   // Get available tokens first
    //   const tokens = await sdk.getTokens();
    //   const testnetTokens = tokens.find(t => t.network === 'testnet');

    //   if (!testnetTokens || testnetTokens.assets.length < 2) {
    //     return;
    //   }

    //   const [USDC, EURC] = testnetTokens.assets;

    //   try {
    //     const pools = await sdk.getPoolByTokens(
    //       USDC.contract,
    //       EURC.contract,
    //       'testnet',
    //       ['soroswap']
    //     );

    //     expect(Array.isArray(pools)).toBe(true);

    //     if (pools.length > 0) {
    //       console.log('✅ Found specific pool for token pair');
    //     } else {
    //       console.log('⚠️  No pool found for this token pair');
    //     }

    //   } catch (error: any) {
    //     console.log('⚠️  Pool lookup failed (expected if no pool exists)');
    //   }
    // }, 15000);
  });

  // describe('Asset and Price Information', () => {
  //   it('should fetch asset lists', async () => {
  //     if (skipTests) return;

  //     const assetLists = await sdk.getAssetList();

  //     if (Array.isArray(assetLists)) {
  //       expect(assetLists.length).toBeGreaterThan(0);

  //       const firstList = assetLists[0];
  //       expect(firstList.name).toBeDefined();
  //       expect(firstList.url).toBeDefined();

  //       console.log('✅ Available asset lists:', assetLists.map(l => l.name));
  //     }
  //   }, 10000);

  //   it('should fetch specific asset list', async () => {
  //     if (skipTests) return;

  //     try {
  //       const soroswapAssets = await sdk.getAssetList('SOROSWAP');

  //       if (!Array.isArray(soroswapAssets)) {
  //         expect(soroswapAssets.name).toBeDefined();
  //         expect(soroswapAssets.provider).toBeDefined();
  //         expect(Array.isArray(soroswapAssets.assets)).toBe(true);

  //         console.log('✅ Soroswap asset list:', soroswapAssets.assets.length, 'assets');
  //       }

  //     } catch (error: any) {
  //       if (error.statusCode === 404) {
  //         console.log('⚠️  SOROSWAP asset list not found');
  //       } else {
  //         throw error;
  //       }
  //     }
  //   }, 10000);

  //   it('should fetch asset prices', async () => {
  //     if (skipTests) return;

  //     const tokens = await sdk.getTokens();
  //     const testnetTokens = tokens.find(t => t.network === 'testnet');

  //     if (!testnetTokens || testnetTokens.assets.length === 0) {
  //       return;
  //     }

  //     const firstToken = testnetTokens.assets[0];

  //     try {
  //       const prices = await sdk.getPrice(
  //         [firstToken.contract],
  //         'testnet',
  //         'USD'
  //       );

  //       expect(Array.isArray(prices)).toBe(true);

  //       if (prices.length > 0) {
  //         const price = prices[0];
  //         expect(price.asset).toBe(firstToken.contract);
  //         expect(price.referenceCurrency).toBe('USD');
  //         expect(price.price).toBeDefined();

  //         console.log('✅ Price data:', price.price, 'USD');
  //       }

  //     } catch (error: any) {
  //       console.log('⚠️  Price data not available for testnet assets');
  //     }
  //   }, 15000);
  // });

  // describe('Error Handling', () => {
  //   it('should handle invalid quote requests gracefully', async () => {
  //     if (skipTests) return;

  //     const invalidQuote: QuoteRequest = {
  //       assetIn: 'INVALID_CONTRACT_ADDRESS',
  //       assetOut: 'ANOTHER_INVALID_CONTRACT',
  //       amount: '1000000',
  //       tradeType: 'EXACT_IN' as TradeType,
  //       protocols: ['soroswap']
  //     };

  //     await expect(sdk.quote(invalidQuote, 'testnet')).rejects.toThrow();
  //   }, 10000);

  //   it('should handle network errors gracefully', async () => {
  //     if (skipTests) return;

  //     // Test with invalid network (should still work as backend might default)
  //     try {
  //       const protocols = await sdk.getProtocols('mainnet');
  //       expect(Array.isArray(protocols)).toBe(true);
  //     } catch (error) {
  //       // Expected if mainnet protocols are not available
  //       expect(error).toBeDefined();
  //     }
  //   }, 10000);
  // });

  // describe('Rate Limiting and Performance', () => {
  //   it('should handle multiple concurrent requests', async () => {
  //     if (skipTests) return;

  //     const promises = [
  //       sdk.checkHealth(),
  //       sdk.getProtocols('testnet'),
  //       sdk.getTokens()
  //     ];

  //     const results = await Promise.all(promises);

  //     expect(results).toHaveLength(3);
  //     expect(results[0]).toBeDefined(); // health
  //     expect(Array.isArray(results[1])).toBe(true); // protocols
  //     expect(Array.isArray(results[2])).toBe(true); // tokens

  //     console.log('✅ Concurrent requests handled successfully');
  //   }, 15000);
  // });

  describe('Liquidity', () => {
    it('should get the pool information and get add liquidity xdr', async () => {
      if (skipTests) return;

      const pools = await sdk.getPoolByTokens(
        "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
        "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
        SupportedNetworks.MAINNET,
        [SupportedProtocols.SOROSWAP]
      );
      console.log("🚀 | it | pool:", pools);

      if (pools.length > 0) {
        const pool = pools[0];
        const ratio = Number(pool.reserveB) / Number(pool.reserveA);
        
        // Calculate proportional amounts
        const amountA = '1000000';
        const amountB = Math.floor(Number(amountA) * ratio).toString();
        
        const addLiquidityTx = await sdk.addLiquidity({
          assetA: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
          assetB: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
          amountA: BigInt(amountA),
          amountB: BigInt(amountB),
          to: 'GB6LEFQDRNJE55Y5X7PDGHSXGK3CA23LWBKVMLBC7C4HISL74YH4QA4N', // Replace with actual wallet address
          slippageBps: '50' // 0.5%
        });

        console.log("🚀 | addLiquidityTx:", addLiquidityTx);
        
        expect(addLiquidityTx).toBeDefined();
        expect(addLiquidityTx.xdr).toBeDefined();
        expect(typeof addLiquidityTx.xdr).toBe('string');
        
        console.log('✅ Add liquidity transaction created successfully');
      } else {
        console.log('⚠️  No pool found for this token pair');
      }
    }, 15000);
  });
});
````

## File: tests/integration/README.md
````markdown
# Integration Tests

These tests actually call the real Soroswap API to verify end-to-end functionality. Unlike unit tests which mock all external dependencies, integration tests:

- ✅ Test real API communication
- ✅ Verify authentication flow works
- ✅ Catch breaking API changes
- ✅ Test actual data flow
- ⚠️ Require valid credentials
- ⚠️ May fail due to network issues
- ⚠️ Slower execution than unit tests

## Setup

### 1. Get Soroswap API Credentials

You need a valid Soroswap account to run integration tests:

1. Visit [Soroswap.Finance](https://soroswap.finance)
2. Create an account or use an existing one
3. Note your email and password

### 2. Set Environment Variables

Set the required environment variables:

```bash
# Option 1: Export in your shell
export SOROSWAP_EMAIL="your-email@example.com"
export SOROSWAP_PASSWORD="your-password"

# Option 2: Create a .env file (DO NOT commit this!)
echo "SOROSWAP_EMAIL=your-email@example.com" > .env
echo "SOROSWAP_PASSWORD=your-password" >> .env
```

## Running Tests

```bash
# Run only integration tests
pnpm run test:integration

# Run both unit and integration tests
pnpm run test:all

# Run unit tests only (default, no credentials needed)
pnpm test
```

## Test Structure

The integration tests are organized into categories:

- **Authentication Flow** - Login, token management, user info
- **Health & System Info** - API health, contract addresses, available tokens
- **Protocols & Quotes** - Available protocols, quote generation, XDR creation
- **Pool Information** - Pool listings, specific token pairs
- **Asset & Price Information** - Asset lists, price data
- **Error Handling** - Invalid requests, network errors
- **Rate Limiting & Performance** - Concurrent requests, timeouts

## Important Notes

### Security
- **Never commit credentials** to version control
- Integration tests use testnet by default for safety
- Credentials are only used for authentication, not stored

### Test Environment
- Tests use Soroswap testnet to avoid real money transactions
- Some features may not be available on testnet
- Tests include graceful handling of missing data

### CI/CD
- Integration tests should be run separately from unit tests in CI
- Consider running them on a schedule rather than every commit
- Set up separate secrets management for credentials

### Debugging

If tests fail:

1. **Check credentials**: Ensure environment variables are set correctly
2. **Check network**: Verify you can reach api.soroswap.finance
3. **Check API status**: Visit the health endpoint manually
4. **Check rate limits**: Wait a few minutes if hitting rate limits

```bash
# Manual health check
curl https://api.soroswap.finance/health

# Check your environment variables
echo $SOROSWAP_EMAIL
echo $SOROSWAP_PASSWORD
```

## Example Test Run

```bash
$ pnpm run test:integration

> soroswap-sdk@1.0.0 test:integration
> jest --config=jest.integration.config.js

[2024-01-15T10:30:00.000Z] 🚀 Starting integration tests against Soroswap API...
[2024-01-15T10:30:00.000Z] 📧 Using email: test@example.com
[2024-01-15T10:30:00.000Z] 🔒 Password: [HIDDEN]

  SoroswapSDK - Integration Tests
    Authentication Flow
      ✓ should authenticate and get user info (2345ms)
    Health and System Info
      ✓ should fetch health status (1234ms)
      ✓ should fetch testnet tokens (987ms)
    [... more tests ...]

[2024-01-15T10:35:00.000Z] ✅ Integration tests completed

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Time:        45.123s
```

## Contributing

When adding new integration tests:

1. Follow the same patterns as existing tests
2. Include graceful handling for missing data on testnet
3. Use realistic but small amounts for any transactions
4. Add appropriate timeouts for network operations
5. Include descriptive console logs for debugging
````

## File: tests/integration/setup.ts
````typescript
/**
 * Integration test setup
 * This file is run before all integration tests
 */

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

// Increase timeout for integration tests
jest.setTimeout(30000);

// Check for required environment variables
const requiredEnvVars = ['SOROSWAP_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`
⚠️  Integration tests require the following environment variables:
${missingVars.map(v => `   - ${v}`).join('\n')}

To run integration tests, set these variables and run:
   pnpm run test:integration

Unit tests (mocked) can still be run with:
   pnpm test
`);
}

// Set default timeout for async operations
const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  // Add timestamp to console logs in integration tests
  originalConsoleLog(`[${new Date().toISOString()}]`, ...args);
};

// Global test state
beforeAll(async () => {
  if (missingVars.length === 0) {
    console.log('🚀 Starting integration tests against Soroswap API...');
    console.log(`🔑 Using API key: ${process.env.SOROSWAP_API_KEY?.substring(0, 10)}...`);
  }
});

afterAll(async () => {
  if (missingVars.length === 0) {
    console.log('✅ Integration tests completed');
  }
});
````

## File: tests/http-client.test.ts
````typescript
import { HttpClient } from '../src/clients/http-client';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    httpClient = new HttpClient(
      'https://test-api.soroswap.finance',
      'sk_test_api_key_123',
      15000
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test-api.soroswap.finance',
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk_test_api_key_123'
        },
        transformRequest: expect.any(Array)
      });
    });

    it('should set up response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('GET requests', () => {
    it('should make GET request and return data', async () => {
      const mockData = { message: 'success' };
      const mockResponse = { data: mockData };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await httpClient.get('/test-endpoint');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', undefined);
      expect(result).toEqual(mockData);
    });

    it('should make GET request with config', async () => {
      const mockData = { message: 'success' };
      const mockResponse = { data: mockData };
      const config = { headers: { 'Custom-Header': 'value' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await httpClient.get('/test-endpoint', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', config);
      expect(result).toEqual(mockData);
    });

    it('should handle GET request errors', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(httpClient.get('/test-endpoint')).rejects.toThrow('Network error');
    });
  });

  describe('POST requests', () => {
    it('should make POST request and return data', async () => {
      const mockData = { message: 'created' };
      const mockResponse = { data: mockData };
      const postData = { name: 'test' };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await httpClient.post('/test-endpoint', postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', postData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should make POST request with config', async () => {
      const mockData = { message: 'created' };
      const mockResponse = { data: mockData };
      const postData = { name: 'test' };
      const config = { headers: { 'Custom-Header': 'value' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await httpClient.post('/test-endpoint', postData, config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', postData, config);
      expect(result).toEqual(mockData);
    });

    it('should handle POST request errors', async () => {
      const error = new Error('Validation error');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(httpClient.post('/test-endpoint', {})).rejects.toThrow('Validation error');
    });
  });

  describe('buildUrlWithQuery', () => {
    it('should build URL without query parameters', () => {
      const result = httpClient.buildUrlWithQuery('/api/test', {});
      expect(result).toBe('/api/test');
    });

    it('should build URL with single query parameter', () => {
      const result = httpClient.buildUrlWithQuery('/api/test', { param1: 'value1' });
      expect(result).toBe('/api/test?param1=value1');
    });

    it('should build URL with multiple query parameters', () => {
      const result = httpClient.buildUrlWithQuery('/api/test', {
        param1: 'value1',
        param2: 'value2'
      });
      expect(result).toBe('/api/test?param1=value1&param2=value2');
    });

    it('should handle array parameters', () => {
      const result = httpClient.buildUrlWithQuery('/api/test', {
        protocols: ['soroswap', 'aqua']
      });
      expect(result).toBe('/api/test?protocols=soroswap&protocols=aqua');
    });

    it('should encode special characters', () => {
      const result = httpClient.buildUrlWithQuery('/api/test', {
        url: 'https://example.com/path?param=value'
      });
      expect(result).toBe('/api/test?url=https%3A%2F%2Fexample.com%2Fpath%3Fparam%3Dvalue');
    });

    it('should filter out undefined and null values', () => {
      const result = httpClient.buildUrlWithQuery('/api/test', {
        param1: 'value1',
        param2: undefined,
        param3: null,
        param4: 'value4'
      });
      expect(result).toBe('/api/test?param1=value1&param4=value4');
    });

    it('should handle empty string values', () => {
      const result = httpClient.buildUrlWithQuery('/api/test', {
        param1: 'value1',
        param2: '',
        param3: 'value3'
      });
      expect(result).toBe('/api/test?param1=value1&param2=&param3=value3');
    });
  });

  describe('BigInt serialization', () => {
    it('should serialize BigInt values in POST data', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const postData = {
        amount: 1000000n,
        normalValue: 'test',
        nested: {
          bigIntValue: 2000000n,
          stringValue: 'nested'
        }
      };

      await httpClient.post('/test-endpoint', postData);

      // Verify the post method was called
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', postData, undefined);
    });
  });

  describe('Error transformation', () => {
    it('should handle request errors', async () => {
      const error = new Error('Request failed');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(httpClient.get('/test-endpoint')).rejects.toThrow('Request failed');
    });

    it('should handle POST request errors', async () => {
      const error = new Error('POST failed');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(httpClient.post('/test-endpoint', {})).rejects.toThrow('POST failed');
    });
  });

  describe('API key authentication', () => {
    it('should include API key in Authorization header', () => {
      const createCall = mockedAxios.create.mock.calls[0]?.[0];
      expect((createCall?.headers as any)?.['Authorization']).toBe('Bearer sk_test_api_key_123');
    });

    it('should work with different API key formats', () => {
      jest.clearAllMocks();
      
      new HttpClient(
        'https://api.example.com',
        'sk_live_another_key_456',
        30000
      );

      const createCall = mockedAxios.create.mock.calls[0]?.[0];
      expect((createCall?.headers as any)?.['Authorization']).toBe('Bearer sk_live_another_key_456');
    });
  });
});
````

## File: tests/quote.test.ts
````typescript
import { SoroswapSDK } from '../src';
import { QuoteRequest, QuoteResponse, SupportedAssetLists, SupportedNetworks, SupportedPlatforms, SupportedProtocols, TradeType } from '../src/types';

describe('SoroswapSDK - Quote Functions', () => {
  let sdk: SoroswapSDK;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create SDK instance
    sdk = new SoroswapSDK({
      apiKey: 'sk_test_api_key_123'
    });
  });

  describe('constructor', () => {
    it('should use default baseUrl when not provided', () => {
      const defaultSdk = new SoroswapSDK({
        apiKey: 'sk_test_key'
      });
      
      expect(defaultSdk).toBeDefined();
    });

    it('should use custom baseUrl when provided', () => {
      const customSdk = new SoroswapSDK({
        apiKey: 'sk_test_key',
        baseUrl: 'http://localhost:3000'
      });
      
      expect(customSdk).toBeDefined();
    });
  });

  describe('quote', () => {
    it('should get quote for swap', async () => {
      const mockQuoteRequest: QuoteRequest = {
        assetIn: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
        assetOut: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
        amount: 10000000n,
        tradeType: 'EXACT_IN' as TradeType,
        protocols: ['soroswap', 'aqua'] as SupportedProtocols[]
      };

      const mockQuoteResponse: QuoteResponse = {
        assetIn: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
        amountIn: "10000000",
        assetOut: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
        amountOut: 8559560,
        otherAmountThreshold: 8559560,
        priceImpactPct: "0.00",
        platform: SupportedPlatforms.AGGREGATOR,
        routePlan: [{
          protocol: SupportedProtocols.SOROSWAP,
          path: ['CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA', 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV'],
          percentage: "100.00"
        }],
        tradeType: TradeType.EXACT_IN,
        rawTrade: {
          amountIn: "10000000",
          amountOutMin: 8559560,
          distribution: [{
            protocol_id: SupportedProtocols.SOROSWAP,
            path: ['CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA', 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV'],
            parts: 10,
            is_exact_in: true
          }]
        }
      } as any;

      // Mock the HTTP client
      (sdk as any).httpClient.post = jest.fn().mockResolvedValue(mockQuoteResponse);

      const result = await sdk.quote(mockQuoteRequest, SupportedNetworks.MAINNET);

      expect(result).toEqual(mockQuoteResponse);
      expect((sdk as any).httpClient.post).toHaveBeenCalledWith(
        '/quote?network=mainnet',
        mockQuoteRequest
      );
    });

    it('should transform assetList enum to string array for API call', async () => {
      const mockQuoteRequest: QuoteRequest = {
        assetIn: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
        assetOut: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
        amount: 10000000n,
        tradeType: 'EXACT_IN' as TradeType,
        protocols: ['soroswap'] as SupportedProtocols[],
        assetList: [SupportedAssetLists.SOROSWAP, SupportedAssetLists.AQUA]
      };

      const mockQuoteResponse: QuoteResponse = {
        assetIn: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
        amountIn: "10000000",
        assetOut: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
        amountOut: 8559560,
        otherAmountThreshold: 8559560,
        priceImpactPct: "0.00",
        platform: SupportedPlatforms.AGGREGATOR,
        routePlan: [],
        tradeType: TradeType.EXACT_IN,
        rawTrade: {
          amountIn: "10000000",
          amountOutMin: 8559560,
          path: ['CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA', 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV']
        }
      } as any;

      // Mock the HTTP client
      (sdk as any).httpClient.post = jest.fn().mockResolvedValue(mockQuoteResponse);

      const result = await sdk.quote(mockQuoteRequest, SupportedNetworks.MAINNET);

      expect(result).toEqual(mockQuoteResponse);
      expect((sdk as any).httpClient.post).toHaveBeenCalledWith(
        '/quote?network=mainnet',
        {
          ...mockQuoteRequest,
          assetList: ['soroswap', 'aqua']
        }
      );
    });

    it('should handle mixed enum and string array for assetList', async () => {
      const mockQuoteRequest: QuoteRequest = {
        assetIn: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
        assetOut: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
        amount: 10000000n,
        tradeType: 'EXACT_IN' as TradeType,
        protocols: ['soroswap'] as SupportedProtocols[],
        assetList: [SupportedAssetLists.SOROSWAP, 'custom_list']
      };

      const mockQuoteResponse: QuoteResponse = {
        assetIn: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
        amountIn: "10000000",
        assetOut: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
        amountOut: 8559560,
        otherAmountThreshold: 8559560,
        priceImpactPct: "0.00",
        platform: SupportedPlatforms.AGGREGATOR,
        routePlan: [],
        tradeType: TradeType.EXACT_IN,
        rawTrade: {
          amountIn: "10000000",
          amountOutMin: 8559560,
          path: ['CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA', 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV']
        }
      } as any;

      // Mock the HTTP client
      (sdk as any).httpClient.post = jest.fn().mockResolvedValue(mockQuoteResponse);

      const result = await sdk.quote(mockQuoteRequest, SupportedNetworks.MAINNET);

      expect(result).toEqual(mockQuoteResponse);
      expect((sdk as any).httpClient.post).toHaveBeenCalledWith(
        '/quote?network=mainnet',
        {
          ...mockQuoteRequest,
          assetList: ['soroswap', 'custom_list']
        }
      );
    });
  });
});
````

## File: tests/setup.ts
````typescript
// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Mock axios for all tests
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  })),
}));

// Set up test environment
beforeEach(() => {
  jest.clearAllMocks();
});
````

## File: tests/soroswap-sdk.test.ts
````typescript
import { SoroswapSDK } from '../src';
import {
  AddLiquidityRequest,
  AssetList,
  AssetListInfo,
  BuildQuoteRequest,
  BuildQuoteResponse,
  LiquidityAction,
  LiquidityResponse,
  Pool,
  PriceData,
  QuoteRequest,
  QuoteResponse,
  RemoveLiquidityRequest,
  SupportedAssetLists,
  SupportedNetworks,
  SupportedPlatforms,
  SupportedProtocols,
  TradeType,
  UserPosition
} from '../src/types';
import { SendRequest } from '../src/types/send';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

describe('SoroswapSDK - Comprehensive Unit Tests', () => {
  let sdk: SoroswapSDK;
  let mockHttpClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create SDK instance
    sdk = new SoroswapSDK({
      apiKey: 'sk_test_api_key_123',
      baseUrl: 'https://test-api.soroswap.finance',
      defaultNetwork: SupportedNetworks.TESTNET,
      timeout: 15000
    });

    // Access the mocked HTTP client
    mockHttpClient = (sdk as any).httpClient;
  });

  describe('Constructor', () => {
    it('should initialize with default values', () => {
      const defaultSdk = new SoroswapSDK({
        apiKey: 'sk_test_key'
      });
      
      expect(defaultSdk).toBeDefined();
    });

    it('should initialize with custom configuration', () => {
      const customSdk = new SoroswapSDK({
        apiKey: 'sk_custom_key',
        baseUrl: 'http://localhost:3000',
        defaultNetwork: SupportedNetworks.MAINNET,
        timeout: 60000
      });
      
      expect(customSdk).toBeDefined();
    });
  });

  describe('Contract Addresses', () => {
    it('should get factory contract address', async () => {
      const mockResponse = { address: 'FACTORY_CONTRACT_ADDRESS_123' };
      mockHttpClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await sdk.getContractAddress(SupportedNetworks.MAINNET, 'factory');

      expect(result).toEqual(mockResponse);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/mainnet/factory');
    });

    it('should get router contract address', async () => {
      const mockResponse = { address: 'ROUTER_CONTRACT_ADDRESS_123' };
      mockHttpClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await sdk.getContractAddress(SupportedNetworks.TESTNET, 'router');

      expect(result).toEqual(mockResponse);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/testnet/router');
    });

    it('should get aggregator contract address', async () => {
      const mockResponse = { address: 'AGGREGATOR_CONTRACT_ADDRESS_123' };
      mockHttpClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await sdk.getContractAddress(SupportedNetworks.MAINNET, 'aggregator');

      expect(result).toEqual(mockResponse);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/mainnet/aggregator');
    });

    it('should handle contract address errors', async () => {
      const errorMessage = 'Contract not found';
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(
        sdk.getContractAddress(SupportedNetworks.MAINNET, 'factory')
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('Protocols', () => {
    it('should get protocols with default network', async () => {
      const mockProtocols = ['soroswap', 'aqua', 'phoenix', 'sdex'];
      mockHttpClient.get = jest.fn().mockResolvedValue(mockProtocols);

      const result = await sdk.getProtocols();

      expect(result).toEqual(mockProtocols);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/protocols?network=testnet');
    });

    it('should get protocols with specified network', async () => {
      const mockProtocols = ['soroswap', 'aqua'];
      mockHttpClient.get = jest.fn().mockResolvedValue(mockProtocols);

      const result = await sdk.getProtocols(SupportedNetworks.MAINNET);

      expect(result).toEqual(mockProtocols);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/protocols?network=mainnet');
    });

    it('should handle protocols error', async () => {
      const errorMessage = 'Failed to fetch protocols';
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(sdk.getProtocols()).rejects.toThrow(errorMessage);
    });
  });

  describe('Quote Operations', () => {
    const mockQuoteRequest: QuoteRequest = {
      assetIn: 'ASSET_IN_123',
      assetOut: 'ASSET_OUT_456',
      amount: 1000000n,
      tradeType: TradeType.EXACT_IN,
      protocols: [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA],
      slippageBps: 50,
      maxHops: 3
    };

    const mockQuoteResponse: QuoteResponse = {
      assetIn: 'ASSET_IN_123',
      amountIn: "1000000",
      assetOut: 'ASSET_OUT_456',
      amountOut: 995000,
      otherAmountThreshold: 995000,
      priceImpactPct: "0.50",
      platform: SupportedPlatforms.AGGREGATOR,
      routePlan: [{
        protocol: SupportedProtocols.SOROSWAP,
        path: ['ASSET_IN_123', 'ASSET_OUT_456'],
        percentage: "100.00"
      }],
      tradeType: TradeType.EXACT_IN,
      rawTrade: {
        amountIn: "1000000",
        amountOutMin: 995000,
        distribution: [{
          protocol_id: SupportedProtocols.SOROSWAP,
          path: ['ASSET_IN_123', 'ASSET_OUT_456'],
          parts: 10,
          is_exact_in: true
        }]
      }
    } as any;

    it('should get quote with default network', async () => {
      mockHttpClient.post = jest.fn().mockResolvedValue(mockQuoteResponse);

      const result = await sdk.quote(mockQuoteRequest);

      expect(result).toEqual(mockQuoteResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/quote?network=testnet', mockQuoteRequest);
    });

    it('should get quote with specified network', async () => {
      mockHttpClient.post = jest.fn().mockResolvedValue(mockQuoteResponse);

      const result = await sdk.quote(mockQuoteRequest, SupportedNetworks.MAINNET);

      expect(result).toEqual(mockQuoteResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/quote?network=mainnet', mockQuoteRequest);
    });

    it('should handle quote with optional parameters', async () => {
      const quoteWithOptionals: QuoteRequest = {
        ...mockQuoteRequest,
        parts: 5,
        feeBps: 30,
        gaslessTrustline: true
      };

      mockHttpClient.post = jest.fn().mockResolvedValue(mockQuoteResponse);

      const result = await sdk.quote(quoteWithOptionals);

      expect(result).toEqual(mockQuoteResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/quote?network=testnet', quoteWithOptionals);
    });

    it('should handle quote errors', async () => {
      const errorMessage = 'No route found';
      mockHttpClient.post = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(sdk.quote(mockQuoteRequest)).rejects.toThrow(errorMessage);
    });
  });

  describe('Build Operations', () => {
    const mockBuildRequest: BuildQuoteRequest = {
      quote: {} as QuoteResponse,
      from: 'WALLET_ADDRESS_123',
      to: 'RECIPIENT_ADDRESS_456',
      referralId: 'REFERRAL_ADDRESS_789'
    };

    const mockBuildResponse: BuildQuoteResponse = {
      xdr: 'MOCK_TRANSACTION_XDR_12345'
    };

    it('should build transaction with default network', async () => {
      mockHttpClient.post = jest.fn().mockResolvedValue(mockBuildResponse);

      const result = await sdk.build(mockBuildRequest);

      expect(result).toEqual(mockBuildResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/quote/build?network=testnet', mockBuildRequest);
    });

    it('should build transaction with specified network', async () => {
      mockHttpClient.post = jest.fn().mockResolvedValue(mockBuildResponse);

      const result = await sdk.build(mockBuildRequest, SupportedNetworks.MAINNET);

      expect(result).toEqual(mockBuildResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/quote/build?network=mainnet', mockBuildRequest);
    });

    it('should handle build with minimal parameters', async () => {
      const minimalBuildRequest: BuildQuoteRequest = {
        quote: {} as QuoteResponse,
        from: 'WALLET_ADDRESS_123'
      };

      mockHttpClient.post = jest.fn().mockResolvedValue(mockBuildResponse);

      const result = await sdk.build(minimalBuildRequest);

      expect(result).toEqual(mockBuildResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/quote/build?network=testnet', minimalBuildRequest);
    });

    it('should handle build errors', async () => {
      const errorMessage = 'Build transaction failed';
      mockHttpClient.post = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(sdk.build(mockBuildRequest)).rejects.toThrow(errorMessage);
    });
  });

  describe('Send Operations', () => {
    const mockSendResponse = {
      hash: 'TRANSACTION_HASH_123',
      status: 'SUCCESS'
    };

    it('should send transaction with default parameters', async () => {
      const expectedRequest: SendRequest = {
        xdr: 'SIGNED_XDR_123',
        launchtube: false
      };

      mockHttpClient.post = jest.fn().mockResolvedValue(mockSendResponse);

      const result = await sdk.send('SIGNED_XDR_123');

      expect(result).toEqual(mockSendResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/send?network=testnet', expectedRequest);
    });

    it('should send transaction with launchtube enabled', async () => {
      const expectedRequest: SendRequest = {
        xdr: 'SIGNED_XDR_123',
        launchtube: true
      };

      mockHttpClient.post = jest.fn().mockResolvedValue(mockSendResponse);

      const result = await sdk.send('SIGNED_XDR_123', true);

      expect(result).toEqual(mockSendResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/send?network=testnet', expectedRequest);
    });

    it('should send transaction with specified network', async () => {
      const expectedRequest: SendRequest = {
        xdr: 'SIGNED_XDR_123',
        launchtube: false
      };

      mockHttpClient.post = jest.fn().mockResolvedValue(mockSendResponse);

      const result = await sdk.send('SIGNED_XDR_123', false, SupportedNetworks.MAINNET);

      expect(result).toEqual(mockSendResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/send?network=mainnet', expectedRequest);
    });

    it('should handle send errors', async () => {
      const errorMessage = 'Transaction failed';
      mockHttpClient.post = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(sdk.send('SIGNED_XDR_123')).rejects.toThrow(errorMessage);
    });
  });

  describe('Pool Operations', () => {
    const mockPools: Pool[] = [
      {
        protocol: SupportedProtocols.SOROSWAP,
        address: 'POOL_ADDRESS_123',
        tokenA: 'TOKEN_A_123',
        tokenB: 'TOKEN_B_456',
        reserveA: 1000000n,
        reserveB: 2000000n,
        ledger: 12345,
        involvesAsset: jest.fn()
      } as Pool
    ];

    it('should get pools with default parameters', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPools);

      const result = await sdk.getPools(SupportedNetworks.MAINNET, [SupportedProtocols.SOROSWAP]);

      expect(result).toEqual(mockPools);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/pools?network=mainnet&protocol=soroswap');
    });

    it('should get pools with asset lists filter', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPools);

      const result = await sdk.getPools(
        SupportedNetworks.MAINNET,
        [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA],
        [SupportedAssetLists.SOROSWAP]
      );

      expect(result).toEqual(mockPools);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/pools?network=mainnet&protocol=soroswap&protocol=aqua&assetList=soroswap'
      );
    });

    it('should get pools with string array asset list', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPools);

      const result = await sdk.getPools(
        SupportedNetworks.MAINNET,
        [SupportedProtocols.SOROSWAP],
        ['soroswap', 'custom_list']
      );

      expect(result).toEqual(mockPools);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/pools?network=mainnet&protocol=soroswap&assetList=soroswap&assetList=custom_list'
      );
    });

    it('should get pools with query options', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPools);

      const result = await sdk.getPools(
        SupportedNetworks.TESTNET,
        [SupportedProtocols.SOROSWAP]
      );

      expect(result).toEqual(mockPools);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/pools?network=testnet&protocol=soroswap');
    });

    it('should handle pools errors', async () => {
      const errorMessage = 'Failed to fetch pools';
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(
        sdk.getPools(SupportedNetworks.MAINNET, [SupportedProtocols.SOROSWAP])
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('Pool by Tokens', () => {
    const mockPools: Pool[] = [
      {
        protocol: SupportedProtocols.SOROSWAP,
        address: 'POOL_ADDRESS_123',
        tokenA: 'TOKEN_A_123',
        tokenB: 'TOKEN_B_456',
        reserveA: 1000000n,
        reserveB: 2000000n,
        ledger: 12345,
        involvesAsset: jest.fn()
      } as Pool
    ];

    it('should get pool by tokens with default parameters', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPools);

      const result = await sdk.getPoolByTokens(
        'TOKEN_A_123',
        'TOKEN_B_456',
        SupportedNetworks.MAINNET,
        [SupportedProtocols.SOROSWAP]
      );

      expect(result).toEqual(mockPools);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/pools/TOKEN_A_123/TOKEN_B_456?network=mainnet&protocol=soroswap'
      );
    });

    it('should get pool by tokens with asset lists', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPools);

      const result = await sdk.getPoolByTokens(
        'TOKEN_A_123',
        'TOKEN_B_456',
        SupportedNetworks.TESTNET,
        [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA]
      );

      expect(result).toEqual(mockPools);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/pools/TOKEN_A_123/TOKEN_B_456?network=testnet&protocol=soroswap&protocol=aqua'
      );
    });

    it('should handle pool by tokens errors', async () => {
      const errorMessage = 'Pool not found';
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(
        sdk.getPoolByTokens('TOKEN_A_123', 'TOKEN_B_456', SupportedNetworks.MAINNET, [SupportedProtocols.SOROSWAP])
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('Liquidity Operations', () => {
    const mockLiquidityRequest: AddLiquidityRequest = {
      assetA: 'TOKEN_A_123',
      assetB: 'TOKEN_B_456',
      amountA: 1000000n,
      amountB: 2000000n,
      to: 'WALLET_ADDRESS_123',
      slippageBps: '50'
    };

    const mockLiquidityResponse: LiquidityResponse = {
      xdr: 'LIQUIDITY_XDR_123',
      type: LiquidityAction.ADD_LIQUIDITY,
      poolInfo: {
        protocol: SupportedProtocols.SOROSWAP,
        address: 'POOL_ADDRESS_123',
        tokenA: 'TOKEN_A_123',
        tokenB: 'TOKEN_B_456',
        reserveA: 1000000n,
        reserveB: 2000000n,
        involvesAsset: jest.fn()
      } as Pool,
      minAmountA: 950000n,
      minAmountB: 1900000n
    };

    it('should add liquidity with default network', async () => {
      mockHttpClient.post = jest.fn().mockResolvedValue(mockLiquidityResponse);

      const result = await sdk.addLiquidity(mockLiquidityRequest);

      expect(result).toEqual(mockLiquidityResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/liquidity/add?network=testnet', mockLiquidityRequest);
    });

    it('should add liquidity with specified network', async () => {
      mockHttpClient.post = jest.fn().mockResolvedValue(mockLiquidityResponse);

      const result = await sdk.addLiquidity(mockLiquidityRequest, SupportedNetworks.MAINNET);

      expect(result).toEqual(mockLiquidityResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/liquidity/add?network=mainnet', mockLiquidityRequest);
    });

    it('should remove liquidity', async () => {
      const removeLiquidityRequest: RemoveLiquidityRequest = {
        assetA: 'TOKEN_A_123',
        assetB: 'TOKEN_B_456',
        liquidity: 500000n,
        amountA: 450000n,
        amountB: 900000n,
        to: 'WALLET_ADDRESS_123',
        slippageBps: '50'
      };

      mockHttpClient.post = jest.fn().mockResolvedValue(mockLiquidityResponse);

      const result = await sdk.removeLiquidity(removeLiquidityRequest);

      expect(result).toEqual(mockLiquidityResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/liquidity/remove?network=testnet', removeLiquidityRequest);
    });

    it('should handle liquidity operation errors', async () => {
      const errorMessage = 'Insufficient liquidity';
      mockHttpClient.post = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(sdk.addLiquidity(mockLiquidityRequest)).rejects.toThrow(errorMessage);
    });
  });

  describe('User Positions', () => {
    const mockPositions: UserPosition[] = [
      {
        poolInfo: {
          protocol: SupportedProtocols.SOROSWAP,
          address: 'POOL_ADDRESS_123',
          tokenA: 'TOKEN_A_123',
          tokenB: 'TOKEN_B_456',
          reserveA: 1000000n,
          reserveB: 2000000n,
          involvesAsset: jest.fn()
        } as Pool,
        userPosition: 750000n
      } as UserPosition
    ];

    it('should get user positions with default network', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPositions);

      const result = await sdk.getUserPositions('USER_ADDRESS_123');

      expect(result).toEqual(mockPositions);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/liquidity/positions/USER_ADDRESS_123?network=testnet');
    });

    it('should get user positions with specified network', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPositions);

      const result = await sdk.getUserPositions('USER_ADDRESS_123', SupportedNetworks.MAINNET);

      expect(result).toEqual(mockPositions);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/liquidity/positions/USER_ADDRESS_123?network=mainnet');
    });

    it('should handle user positions errors', async () => {
      const errorMessage = 'User not found';
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(sdk.getUserPositions('USER_ADDRESS_123')).rejects.toThrow(errorMessage);
    });
  });

  describe('Asset Lists', () => {
    const mockAssetLists: AssetListInfo[] = [
      {
        name: 'Soroswap Token List',
        url: 'https://example.com/tokenlist.json'
      } as AssetListInfo
    ];

    const mockAssetList: AssetList = {
      name: 'Soroswap Token List',
      provider: 'Soroswap',
      description: 'Official Soroswap token list',
      version: '1.0.0',
      network: 'mainnet',
      assets: []
    } as AssetList;

    it('should get all asset lists', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockAssetLists);

      const result = await sdk.getAssetList();

      expect(result).toEqual(mockAssetLists);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/asset-list');
    });

    it('should get specific asset list', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockAssetList);

      const result = await sdk.getAssetList(SupportedAssetLists.SOROSWAP);

      expect(result).toEqual(mockAssetList);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/asset-list?name=https%3A%2F%2Fraw.githubusercontent.com%2Fsoroswap%2Ftoken-list%2Fmain%2FtokenList.json'
      );
    });

    it('should handle asset list errors', async () => {
      const errorMessage = 'Asset list not found';
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(sdk.getAssetList()).rejects.toThrow(errorMessage);
    });
  });

  describe('Price Operations', () => {
    const mockPriceData: PriceData[] = [
      {
        asset: 'TOKEN_123',
        price: 1.50,
        timestamp: new Date()
      } as PriceData
    ];

    it('should get price for single asset', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPriceData);

      const result = await sdk.getPrice('TOKEN_123', SupportedNetworks.MAINNET);

      expect(result).toEqual(mockPriceData);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/price?network=mainnet&asset=TOKEN_123');
    });

    it('should get price for multiple assets', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPriceData);

      const result = await sdk.getPrice(['TOKEN_123', 'TOKEN_456'], SupportedNetworks.MAINNET);

      expect(result).toEqual(mockPriceData);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/price?network=mainnet&asset=TOKEN_123&asset=TOKEN_456');
    });

    it('should get price with custom currency', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPriceData);

      const result = await sdk.getPrice('TOKEN_123', SupportedNetworks.MAINNET);

      expect(result).toEqual(mockPriceData);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/price?network=mainnet&asset=TOKEN_123');
    });

    it('should get price with default network', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockPriceData);

      const result = await sdk.getPrice('TOKEN_123');

      expect(result).toEqual(mockPriceData);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/price?network=testnet&asset=TOKEN_123');
    });

    it('should handle price errors', async () => {
      const errorMessage = 'Price data not available';
      mockHttpClient.get = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(sdk.getPrice('TOKEN_123')).rejects.toThrow(errorMessage);
    });
  });

  describe('HTTP Client Integration', () => {
    it('should handle network timeout errors', async () => {
      const timeoutError = { message: 'Network timeout', statusCode: 0 };
      mockHttpClient.get = jest.fn().mockRejectedValue(timeoutError);

      await expect(sdk.getProtocols()).rejects.toEqual(timeoutError);
    });

    it('should handle API errors with status codes', async () => {
      const apiError = { message: 'Unauthorized', statusCode: 401 };
      mockHttpClient.post = jest.fn().mockRejectedValue(apiError);

      const quoteRequest: QuoteRequest = {
        assetIn: 'ASSET_IN',
        assetOut: 'ASSET_OUT',
        amount: 1000n,
        tradeType: TradeType.EXACT_IN,
        protocols: [SupportedProtocols.SOROSWAP]
      };

      await expect(sdk.quote(quoteRequest)).rejects.toEqual(apiError);
    });

    it('should handle malformed response errors', async () => {
      const malformedError = { message: 'Invalid JSON response', statusCode: 500 };
      mockHttpClient.get = jest.fn().mockRejectedValue(malformedError);

      await expect(sdk.getContractAddress(SupportedNetworks.MAINNET, 'factory')).rejects.toEqual(malformedError);
    });
  });

  describe('URL Building', () => {
    it('should properly encode query parameters', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue([]);

      await sdk.getPools(
        SupportedNetworks.MAINNET,
        [SupportedProtocols.SOROSWAP],
        [SupportedAssetLists.SOROSWAP]
      );

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/pools?network=mainnet&protocol=soroswap&assetList=soroswap'
      );
    });

    it('should handle multiple protocol parameters', async () => {
      mockHttpClient.get = jest.fn().mockResolvedValue([]);

      await sdk.getPools(
        SupportedNetworks.TESTNET,
        [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA, SupportedProtocols.PHOENIX]
      );

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/pools?network=testnet&protocol=soroswap&protocol=aqua&protocol=phoenix'
      );
    });
  });
});
````

## File: .gitignore
````
.env
node_modules
dist
.DS_Store
````

## File: CLAUDE.md
````markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official TypeScript SDK for Soroswap.Finance - a DEX and exchange aggregator built on Stellar using Soroban smart contracts. The SDK provides server-side access to trading operations, liquidity management, market data, and authentication.

## Development Commands

### Build and Development
- `pnpm run build` - Compile TypeScript to JavaScript in dist/
- `pnpm run build:watch` - Watch mode compilation
- `pnpm run clean` - Remove dist/ directory

### Testing
- `pnpm test` or `pnpm run test:unit` - Run unit tests with mocked dependencies
- `pnpm run test:integration` - Run integration tests against real API (requires credentials)
- `pnpm run test:all` - Run both unit and integration tests
- `pnpm run test:watch` - Watch mode for unit tests
- `pnpm run test:coverage` - Generate coverage report

### Code Quality
- `pnpm run lint` - Run ESLint on TypeScript files
- `pnpm run lint:fix` - Fix ESLint issues automatically

### Publishing
- `pnpm run prepare` - Builds before publishing
- `pnpm run prepublishOnly` - Runs tests and linting before publishing

## Architecture

### Core Components
- **SoroswapSDK** (`src/soroswap-sdk.ts`) - Main SDK class that orchestrates all operations
- **HttpClient** (`src/clients/http-client.ts`) - Centralized HTTP client with API key authentication

### API Operations
The SDK provides methods for:
- **Trading**: quote(), build(), send() - Get quotes, build transactions, submit to network
- **Liquidity**: addLiquidity(), removeLiquidity(), getUserPositions()
- **Market Data**: getPools(), getPrice(), getAssetList()
- **System**: getProtocols(), getContractAddress()

### Authentication Flow
1. SDK initializes with API key
2. HttpClient sets Authorization header with Bearer token
3. All API calls use the same API key for authentication
4. No token refresh or session management needed

### Type System
Comprehensive TypeScript types are defined in `src/types/`:
- `common.ts` - Core enums and base types
- `quote.ts` - Trading quote types
- `pools.ts` - Pool and liquidity types
- `assets.ts` - Asset and price types
- `auth.ts` - Authentication types
- `send.ts` - Transaction submission types

## Testing Strategy

### Unit Tests
- Located in `tests/` directory
- Mock all external dependencies using Jest
- Focus on SDK logic and type safety
- Configuration in `jest.config.js`

### Integration Tests
- Located in `tests/integration/`
- Test against real Soroswap API
- Require environment variables: `SOROSWAP_EMAIL`, `SOROSWAP_PASSWORD`
- Configuration in `jest.integration.config.js`
- May be flaky due to network/API dependencies

## Environment Configuration

### Required Environment Variables for Integration Tests
```bash
export SOROSWAP_API_KEY="sk_your_api_key_here"
```

### SDK Configuration
The SDK accepts configuration including:
- `apiKey` - API key for authentication (must start with 'sk_')
- `baseUrl` - Custom API base URL (optional, defaults to 'https://api.soroswap.finance')
- `defaultNetwork` - MAINNET or TESTNET
- `timeout` - Request timeout (default 30s, consider increasing for launchtube)

## Build Configuration

### TypeScript
- Target: ES2020
- CommonJS modules
- Strict mode enabled
- Generates declaration files and source maps
- Output to `dist/` directory

### Package Structure
- Entry point: `dist/index.js`
- Types: `dist/index.d.ts`
- Published files: `dist/`, `README.md`, `LICENSE`

## Key Implementation Notes

### Authentication
- Server-side only - API keys should never be exposed to frontend
- Simple API key authentication with Bearer token
- Use environment variables for API keys in production

### Amount Handling
- All amounts must be BigInt when passed to quote() method
- String amounts used for liquidity operations
- Proper type checking enforced in TypeScript

### Error Handling
- All API operations can throw errors
- Wrap calls in try-catch blocks
- Integration tests may fail due to network issues
- API key authentication errors will be returned immediately

### Network Support
- Supports both MAINNET and TESTNET
- Default network configurable in SDK constructor
- Network can be overridden per API call

## Development Patterns

### Adding New API Methods
1. Define TypeScript interfaces in appropriate `src/types/` file
2. Add method to `SoroswapSDK` class
3. Use `this.httpClient` for HTTP calls
4. Add unit tests with mocked responses
5. Consider adding integration test if appropriate

### Type Safety
- All API responses should have corresponding TypeScript interfaces
- Use union types for different response formats (e.g., ExactIn vs ExactOut trades)
- Export all types from `src/types/index.ts`

### Error Boundaries
- HTTP errors are handled by HttpClient
- Authentication errors are returned immediately (no retry logic needed)
- Network timeouts should be handled gracefully
````

## File: eslint.config.js
````javascript
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");

module.exports = [
  {
    ignores: ["dist/**/*", "node_modules/**/*", "**/*.js", "tests/**/*"]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      // Base ESLint recommended rules
      "no-unused-vars": "off", // Turn off base rule
      "no-undef": "error",
      "no-redeclare": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "no-duplicate-case": "error",
      "no-empty": "error",
      "no-extra-boolean-cast": "error",
      "no-extra-semi": "error",
      "no-func-assign": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-sparse-arrays": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      
      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-var-requires": "off",
      
      // General rules
      "prefer-const": "error",
      "no-var": "error",
    },
  }
];
````

## File: jest.config.js
````javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  testPathIgnorePatterns: ['/tests/integration/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
````

## File: jest.integration.config.js
````javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/*.integration.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testTimeout: 30000, // 30 seconds for integration tests
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  // Don't collect coverage for integration tests by default
  collectCoverage: false,
};
````

## File: package.json
````json
{
  "name": "@soroswap/sdk",
  "version": "0.3.2",
  "description": "Official TypeScript SDK for Soroswap.Finance API - DEX and exchange aggregator on Stellar",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist/**/*",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "test": "jest",
    "test:unit": "jest",
    "test:integration": "jest --config=jest.integration.config.js",
    "test:all": "pnpm run test:unit && pnpm run test:integration",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "prepare": "pnpm run build",
    "prepublishOnly": "pnpm test && pnpm run lint",
    "clean": "rimraf dist"
  },
  "keywords": [
    "soroswap",
    "stellar",
    "soroban",
    "dex",
    "defi",
    "aggregator",
    "swap",
    "liquidity",
    "sdk",
    "typescript"
  ],
  "author": "Soroswap Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/soroswap/sdk.git"
  },
  "bugs": {
    "url": "https://github.com/soroswap/sdk/issues"
  },
  "homepage": "https://soroswap.finance",
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.1",
    "@eslint/js": "^9.30.0",
    "@types/jest": "^30.0.0",
    "@types/node": "^24.0.4",
    "@typescript-eslint/eslint-plugin": "^8.35.0",
    "@typescript-eslint/parser": "^8.35.0",
    "dotenv": "^16.5.0",
    "eslint": "^9.29.0",
    "globals": "^16.2.0",
    "jest": "^30.0.3",
    "rimraf": "^6.0.1",
    "ts-jest": "^29.4.0",
    "typescript": "^5.8.3"
  },
  "dependencies": {
    "axios": "^1.10.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
````

## File: README.md
````markdown
# Soroswap SDK

Official TypeScript SDK for [Soroswap.Finance](https://soroswap.finance) - The first DEX and exchange aggregator built on Stellar, powered by smart contracts on Soroban.

## 🌟 Features

- **🔐 Simple API Key Authentication**: Secure API key-based authentication
- **💱 Trading Operations**: Get quotes, build transactions, send them to the network
- **💧 Liquidity Management**: Add/remove liquidity and track positions
- **📊 Market Data**: Access pools, prices, and asset information
- **🔒 Server-Side Focused**: Secure handling of API keys and sensitive operations
- **📝 TypeScript Support**: Full type safety with comprehensive interfaces
- **⚡ Lightweight**: No complex authentication flows or token management
- **🧪 Well Tested**: Comprehensive unit test coverage

## 🚀 Installation

```bash
pnpm install soroswap-sdk
```

## 📖 Quick Start

```typescript
import { SoroswapSDK, SupportedNetworks, SupportedProtocols, TradeType } from '@soroswap/sdk';

// Initialize the SDK
const soroswapClient = new SoroswapSDK({
  apiKey: 'sk_your_api_key_here'
});

// Get a quote for a swap
const quote = await soroswapClient.quote({
  assetIn: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
  assetOut: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
  amount: 10000000n, // Note: Amount must be a BigInt
  tradeType: TradeType.EXACT_IN,
  protocols: [SupportedProtocols.SDEX, SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA],
});

// Build the transaction XDR from the quote
const buildResponse = await soroswapClient.build({
  quote,
  from: 'YOUR_WALLET_ADDRESS',
  to: 'RECIPIENT_ADDRESS'
});

// Sign the transaction with your preferred signer
const signedXdr = await yourSigner.sign(buildResponse.xdr);

// Send the signed transaction
const result = await soroswapClient.send(signedXdr, false); // launchtube = false
console.log('Transaction result:', result);
```

## 🔧 Configuration

### SDK Configuration Options

```typescript
interface SoroswapSDKConfig {
  apiKey: string;                   // Your Soroswap API key (starts with 'sk_')
  baseUrl?: string;                 // Custom API base URL (defaults to 'https://api.soroswap.finance')
  defaultNetwork?: SupportedNetworks;  // SupportedNetworks.MAINNET | SupportedNetworks.TESTNET
  timeout?: number;                // Request timeout in ms (defaults to 30000) you might want to adjust this if using launchtube
}
```

### Environment Variables

For better security, you can use environment variables:

```typescript
const soroswapClient = new SoroswapSDK({
  apiKey: process.env.SOROSWAP_API_KEY!,
  baseUrl: process.env.SOROSWAP_API_URL, // Optional: for localhost or custom API
  defaultNetwork: process.env.NODE_ENV === 'production' 
    ? SupportedNetworks.MAINNET 
    : SupportedNetworks.TESTNET
});

// Example for local development:
const localClient = new SoroswapSDK({
  apiKey: 'sk_local_api_key',
  baseUrl: 'http://localhost:3000',
  defaultNetwork: SupportedNetworks.TESTNET
});
```

## 📚 API Reference

### Authentication

The SDK uses API key authentication - no complex authentication flows needed:

```typescript
// Simply initialize with your API key
const soroswapClient = new SoroswapSDK({
  apiKey: 'sk_your_api_key_here'
});
```

### Trading Operations

#### Get Available Protocols

```typescript
const protocols = await soroswapClient.getProtocols(SupportedNetworks.MAINNET);
// Returns: ['sdex', 'soroswap', 'phoenix', 'aqua']
```

#### Get Quote

```typescript
const quote = await soroswapClient.quote({
  assetIn: 'TOKEN_A_CONTRACT',
  assetOut: 'TOKEN_B_CONTRACT',
  amount: 1000000n, // BigInt required
  tradeType: TradeType.EXACT_IN,
  protocols: [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA],
  slippageBps: '50', // 0.5% in basis points
  maxHops: 2,
  feeBps: 30, // Optional fee in basis points
});
```

#### Build Transaction

After getting a quote, build the transaction XDR:

```typescript
const buildResponse = await soroswapClient.build({
  quote: quote,
  from: 'YOUR_WALLET_ADDRESS',
  to: 'RECIPIENT_ADDRESS', // Optional, defaults to 'from'
  referralId: 'REFERRAL_WALLET_ADDRESS' // Required if quote includes feeBps
});

// buildResponse.xdr contains the transaction ready for signing
```

#### Send Signed Transaction

```typescript
const result = await soroswapClient.send(
  signedXdr,           // The signed transaction XDR
  false,               // launchtube: boolean (default false)
  SupportedNetworks.MAINNET  // Optional network override
);
```

### Pool Operations

#### Get Pools

```typescript
// Get all pools for specific protocols
const pools = await soroswapClient.getPools(
  SupportedNetworks.MAINNET,
  [SupportedProtocols.SOROSWAP, SupportedProtocols.AQUA],
  [SupportedAssetLists.SOROSWAP] // Optional asset list filter
);

// Get specific pool for token pair
const pool = await soroswapClient.getPoolByTokens(
  'TOKEN_A_CONTRACT',
  'TOKEN_B_CONTRACT',
  SupportedNetworks.MAINNET,
  [SupportedProtocols.SOROSWAP]
);
```

### Liquidity Operations

#### Add Liquidity

**Important**: Before adding liquidity, you should fetch the existing pool to calculate the proper token proportions. The amounts must maintain the current pool ratio, otherwise the transaction will fail during simulation.

```typescript
// First, get the current pool to understand the ratio
const pools = await soroswapClient.getPoolByTokens(
  'TOKEN_A_CONTRACT',
  'TOKEN_B_CONTRACT',
  SupportedNetworks.MAINNET,
  [SupportedProtocols.SOROSWAP]
);

if (pools.length > 0) {
  const pool = pools[0];
  const ratio = Number(pool.reserveB) / Number(pool.reserveA);
  
  // Calculate proportional amounts
  const amountA = '1000000';
  const amountB = (Number(amountA) * ratio).toString();
  
  const addLiquidityTx = await soroswapClient.addLiquidity({
    assetA: 'TOKEN_A_CONTRACT',
    assetB: 'TOKEN_B_CONTRACT',
    amountA: amountA,
    amountB: amountB,
    to: 'YOUR_WALLET_ADDRESS',
    slippageBps: '50' // 0.5%
  });

  // Sign and send the transaction
  const signedXdr = await yourSigner.sign(addLiquidityTx.xdr);
  const result = await soroswapClient.send(signedXdr, false);
}
```

> **Note**: All liquidity transactions are simulated before execution. If the amounts don't match the required proportions or if there are insufficient funds, the transaction will return an error during simulation.

#### Remove Liquidity

```typescript
const removeLiquidityTx = await soroswapClient.removeLiquidity({
  assetA: 'TOKEN_A_CONTRACT',
  assetB: 'TOKEN_B_CONTRACT',
  liquidity: '500000',
  amountA: '450000',
  amountB: '900000',
  to: 'YOUR_WALLET_ADDRESS',
  slippageBps: '50'
});
```

#### Get User Positions

```typescript
const positions = await soroswapClient.getUserPositions(
  'USER_WALLET_ADDRESS',
  SupportedNetworks.MAINNET
);
```

### Market Data

#### Get Asset Prices

```typescript
// Single asset price
const prices = await soroswapClient.getPrice(
  'TOKEN_CONTRACT_ADDRESS',
  SupportedNetworks.MAINNET
);

// Multiple asset prices
const prices = await soroswapClient.getPrice([
  'TOKEN_A_CONTRACT',
  'TOKEN_B_CONTRACT'
], SupportedNetworks.MAINNET);
```

#### Get Asset Lists

```typescript
// Get all available asset lists metadata
const assetListsInfo = await soroswapClient.getAssetList();

// Get specific asset list
const soroswapAssets = await soroswapClient.getAssetList(SupportedAssetLists.SOROSWAP);
```

### System Information

#### Get Contract Addresses

```typescript
const factoryAddress = await soroswapClient.getContractAddress(SupportedNetworks.MAINNET, 'factory');
const routerAddress = await soroswapClient.getContractAddress(SupportedNetworks.MAINNET, 'router');
const aggregatorAddress = await soroswapClient.getContractAddress(SupportedNetworks.MAINNET, 'aggregator');
```

## 🔐 Security Best Practices

1. **Environment Variables**: Store API keys in environment variables, not in code
2. **Server-Side Only**: This SDK is designed for server-side use only
3. **API Key Security**: Keep your API keys secure and never commit them to version control
4. **Error Handling**: Always wrap API calls in try-catch blocks

```typescript
try {
  const quote = await soroswapClient.quote(quoteParams);
  const buildResponse = await soroswapClient.build({ quote, from: walletAddress });
  // Handle success
} catch (error) {
  console.error('Quote/build failed:', error.message);
  // Handle error
}
```

## 🏗️ Development

### Building

```bash
pnpm run build
```

### Testing

The SDK includes two types of tests:

#### Unit Tests (Mocked)
Fast tests that mock all external dependencies:

```bash
# Run unit tests (default)
pnpm test

# Run with coverage
pnpm run test:coverage

# Watch mode for development
pnpm run test:watch
```

#### Integration Tests (Real API)
Tests that actually call the Soroswap API:

```bash
# Set up API key first
export SOROSWAP_API_KEY="sk_your_api_key_here"

# Run integration tests
pnpm run test:integration

# Run both unit and integration tests
pnpm run test:all
```

**Note**: Integration tests require a valid Soroswap API key and may fail due to network issues or API changes. See [Integration Test Documentation](./tests/integration/README.md) for detailed setup.

### Linting

```bash
pnpm run lint
pnpm run lint:fix
```

## 🌐 Frontend Integration Considerations

While this SDK is server-side focused, you can create secure frontend integrations:

### Recommended Architecture

```typescript
// Backend API endpoint
app.post('/api/quote', async (req, res) => {
  try {
    const soroswapClient = new SoroswapSDK({
      apiKey: process.env.SOROSWAP_API_KEY!
    });
    
    const quote = await soroswapClient.quote(req.body);
    const buildResponse = await soroswapClient.build({
      quote,
      from: req.body.walletAddress
    });
    
    // Only return the XDR and quote data, not sensitive info
    res.json({
      xdr: buildResponse.xdr,
      quote: {
        assetIn: quote.assetIn,
        assetOut: quote.assetOut,
        tradeType: quote.tradeType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend widget
async function getQuoteAndBuild(quoteParams) {
  const response = await fetch('/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteParams)
  });
  return response.json();
}
```

## 📊 Type Definitions

The SDK exports comprehensive TypeScript types:

```typescript
import {
  SoroswapSDK,
  SoroswapSDKConfig,
  SupportedNetworks,
  SupportedProtocols,
  SupportedAssetLists,
  TradeType,
  QuoteRequest,
  QuoteResponse,
  BuildQuoteRequest,
  BuildQuoteResponse,
  Pool,
  UserPosition,
  PriceData,
  AssetList,
  AssetListInfo,
  // ... and many more
} from 'soroswap-sdk';
```

### Example: Working with Types

```typescript
import { 
  QuoteRequest, 
  TradeType, 
  SupportedProtocols,
  ExactInBuildTradeReturn 
} from 'soroswap-sdk';

const quoteRequest: QuoteRequest = {
  assetIn: 'TOKEN_A',
  assetOut: 'TOKEN_B',
  amount: 1000000n,
  tradeType: TradeType.EXACT_IN,
  protocols: [SupportedProtocols.SOROSWAP]
};

const quote = await soroswapClient.quote(quoteRequest);

// Type-safe access to quote properties
if (quote.tradeType === TradeType.EXACT_IN) {
  const exactInQuote = quote as ExactInBuildTradeReturn;
  console.log('Expected output:', exactInQuote.trade.expectedAmountOut);
}
```

## 🔗 Links

- [Soroswap.Finance](https://soroswap.finance)
- [Documentation](https://docs.soroswap.finance)
- [API Documentation](https://api.soroswap.finance)
- [GitHub Repository](https://github.com/soroswap/sdk)

---

Built with ❤️ by the Soroswap team.
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
````
