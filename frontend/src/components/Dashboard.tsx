import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  LogOut, 
  Settings, 
  TrendingUp, 
  Activity, 
  Copy, 
  CheckCircle,
  Bot,
  ArrowRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
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

  // Fetch balance from backend
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
    navigate('/');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Wallet Information</h2>
            <button
              onClick={() => navigate('/profile')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Profile
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Managed Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                  {formatAddress(managedWallet.publicKey)}
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
                Managed Wallet XLM Balance
              </label>
              <div className="text-2xl font-bold text-gray-900">
                {isLoadingBalance ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                ) : (
                  `${parseFloat(balance).toFixed(2)} XLM`
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => navigate('/chat')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
            <p className="text-gray-600 text-sm">
              Chat with Hunta to analyze DeFi opportunities and get trading insights
            </p>
          </div>

          <div 
            onClick={() => navigate('/portfolio')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio</h3>
            <p className="text-gray-600 text-sm">
              View your portfolio performance and track your DeFi investments
            </p>
          </div>

          <div 
            onClick={() => navigate('/trading')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trading</h3>
            <p className="text-gray-600 text-sm">
              Execute trades and manage your DeFi positions with AI assistance
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm">Your trading and portfolio activities will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 