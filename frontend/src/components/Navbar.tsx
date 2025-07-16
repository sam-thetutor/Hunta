import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Wallet, 
  LogOut, 
  User, 
  TrendingUp, 
  Activity,
  Copy,
  CheckCircle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, connectWallet, disconnectWallet, isLoading } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const copyAddress = async () => {
    if (user?.publicKey) {
      await navigator.clipboard.writeText(user.publicKey);
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

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Hunta</h1>
          </div>

          {/* Navigation Links - Only show when authenticated */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate('/chat')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                AI Assistant
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Profile
              </button>
            </div>
          )}

          {/* Right side - Wallet connection or user info */}
          <div className="flex items-center space-x-4">
            {user ? (
              // User is connected - show wallet info and disconnect
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <Wallet className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.walletType}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {formatAddress(user.publicKey)}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Disconnect</span>
                </button>
              </div>
            ) : (
              // User is not connected - show connect button
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 