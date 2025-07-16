import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

interface SwapQuote {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  priceImpact: string;
  fee: string;
  validUntil: number;
}

export const SwapInterface: React.FC = () => {
  const { sessionToken } = useAuth();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedInputToken, setSelectedInputToken] = useState<string>('');
  const [selectedOutputToken, setSelectedOutputToken] = useState<string>('');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load available tokens
  useEffect(() => {
    if (sessionToken) {
      loadTokens();
    }
  }, [sessionToken]);

  const loadTokens = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/swap/tokens', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens);
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
    }
  };

  // Get quote when parameters change
  useEffect(() => {
    if (selectedInputToken && selectedOutputToken && inputAmount && parseFloat(inputAmount) > 0) {
      getQuote();
    } else {
      setQuote(null);
    }
  }, [selectedInputToken, selectedOutputToken, inputAmount]);

  const getQuote = async () => {
    if (!sessionToken) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/swap/quote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputToken: selectedInputToken,
          outputToken: selectedOutputToken,
          inputAmount,
          slippageTolerance: 0.5
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuote(data.quote);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to get quote');
      }
    } catch (error) {
      setError('Failed to get quote');
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async () => {
    if (!sessionToken || !quote) return;

    setIsExecuting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/swap/execute', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputToken: selectedInputToken,
          outputToken: selectedOutputToken,
          inputAmount,
          slippageTolerance: 0.5
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccess(`Swap executed successfully! Transaction hash: ${data.swap.hash}`);
        setQuote(null);
        setInputAmount('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to execute swap');
      }
    } catch (error) {
      setError('Failed to execute swap');
    } finally {
      setIsExecuting(false);
    }
  };

  const switchTokens = () => {
    setSelectedInputToken(selectedOutputToken);
    setSelectedOutputToken(selectedInputToken);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Swap Tokens</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Input Token */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From
        </label>
        <div className="flex space-x-2">
          <select
            value={selectedInputToken}
            onChange={(e) => setSelectedInputToken(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select token</option>
            {tokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Switch Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={switchTokens}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Output Token */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          To
        </label>
        <select
          value={selectedOutputToken}
          onChange={(e) => setSelectedOutputToken(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} - {token.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quote Display */}
      {quote && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">You will receive:</span>
            <span className="font-semibold">
              {parseFloat(quote.outputAmount).toFixed(6)} {quote.outputToken.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Price Impact:</span>
            <span className="text-sm">{quote.priceImpact}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fee:</span>
            <span className="text-sm">{quote.fee}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {isLoading && (
          <button
            disabled
            className="w-full py-3 px-4 bg-gray-300 text-gray-500 rounded-lg flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Getting Quote...
          </button>
        )}

        {!isLoading && quote && (
          <button
            onClick={executeSwap}
            disabled={isExecuting}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center justify-center"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Executing Swap...
              </>
            ) : (
              'Execute Swap'
            )}
          </button>
        )}

        {!isLoading && !quote && selectedInputToken && selectedOutputToken && inputAmount && (
          <button
            disabled
            className="w-full py-3 px-4 bg-gray-300 text-gray-500 rounded-lg"
          >
            Enter amount to get quote
          </button>
        )}
      </div>
    </div>
  );
}; 