import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  Copy, 
  CheckCircle, 
  Settings, 
  Shield, 
  Activity,
  Bot
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, managedWallet, sessionToken, disconnectWallet } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (managedWallet?.publicKey && sessionToken) {
      fetchBalance();
    }
  }, [managedWallet?.publicKey, sessionToken]);

  const fetchBalance = async () => {
    if (!sessionToken) return;
    
    setIsLoadingBalance(true);
    try {
      const response = await fetch('http://localhost:3001/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const xlmBalance = data.balances.find((b: any) => b.asset === 'XLM');
        setBalance(xlmBalance ? xlmBalance.balance : '0');
      } else {
        console.error('Failed to fetch balance');
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const copyAddress = async () => {
    if (managedWallet?.publicKey) {
      await navigator.clipboard.writeText(managedWallet.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/connect');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!managedWallet) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managed Wallet Not Found</h2>
            <p className="text-gray-600 mb-6">
              Your managed wallet is being created. Please try refreshing the page or reconnecting your wallet.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Wallet Profile</h2>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Wallet Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Wallet Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Type
                  </label>
                  <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    {managedWallet.walletType}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Public Key
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1 break-all">
                      {user.publicKey}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Managed Wallet Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1 break-all">
                      {managedWallet.publicKey}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(managedWallet.publicKey);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy managed wallet address"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Created
                  </label>
                  <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Balance and Stats */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Balance & Stats
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Managed Wallet XLM Balance
                  </label>
                  <div className="text-3xl font-bold text-gray-900">
                    {isLoadingBalance ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    ) : (
                      `${parseFloat(balance).toFixed(2)} XLM`
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Login
                  </label>
                  <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    {new Date(user.lastLogin).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Network</h4>
                <p className="text-sm text-gray-600">Testnet (for development)</p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Testnet
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Security</h4>
                <p className="text-sm text-gray-600">Wallet connection is secure</p>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Secure
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">AI Assistant</h4>
                <p className="text-sm text-gray-600">Chat with Hunta for DeFi insights</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Open Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 