import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  ISupportedWallet
} from '@creit.tech/stellar-wallets-kit';

// Types
export interface User {
  id: string;
  publicKey: string;
  createdAt: string;
  lastLogin: string;
}

export interface ManagedWallet {
  id: string;
  publicKey: string;
  walletName: string;
  walletType: string;
  createdAt: string;
}

export interface WalletBalance {
  asset: string;
  balance: string;
}

export interface AuthContextType {
  user: User | null;
  managedWallet: ManagedWallet | null;
  sessionToken: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  forceReset: () => void;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  stellarKit: StellarWalletsKit | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [managedWallet, setManagedWallet] = useState<ManagedWallet | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stellarKit, setStellarKit] = useState<StellarWalletsKit | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Initialize Stellar Wallets Kit
  useEffect(() => {
    const initializeKit = () => {
      try {
        const kit = new StellarWalletsKit({
          network: WalletNetwork.TESTNET, // Change to PUBLIC for mainnet
          modules: allowAllModules(),
        });
        setStellarKit(kit);
      } catch (err) {
        console.error('Failed to initialize Stellar Wallets Kit:', err);
        setError('Failed to initialize wallet connection');
      }
    };

    initializeKit();
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const savedUser = localStorage.getItem('hunta_user');
      const savedManagedWallet = localStorage.getItem('hunta_managed_wallet');
      const savedSessionToken = localStorage.getItem('hunta_session_token');
      
      if (savedUser && savedManagedWallet && savedSessionToken) {
        try {
          const userData = JSON.parse(savedUser);
          const walletData = JSON.parse(savedManagedWallet);
          
          // Verify session with backend
          const response = await fetch('http://localhost:3001/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${savedSessionToken}`,
            },
          });
          
          if (response.ok) {
            const profileData = await response.json();
            
            // Update with fresh data from backend
            setUser(profileData.user);
            setManagedWallet(profileData.managedWallet);
            setSessionToken(savedSessionToken);
            
            // Update localStorage with fresh data
            localStorage.setItem('hunta_user', JSON.stringify(profileData.user));
            localStorage.setItem('hunta_managed_wallet', JSON.stringify(profileData.managedWallet));
            
            console.log('Session restored successfully');
          } else {
            // Session invalid, clear storage immediately
            console.log('Session invalid (status:', response.status, '), clearing storage');
            localStorage.removeItem('hunta_user');
            localStorage.removeItem('hunta_managed_wallet');
            localStorage.removeItem('hunta_session_token');
            
            // Reset state
            setUser(null);
            setManagedWallet(null);
            setSessionToken(null);
          }
        } catch (err) {
          console.error('Failed to verify session:', err);
          // Clear storage on any error
          localStorage.removeItem('hunta_user');
          localStorage.removeItem('hunta_managed_wallet');
          localStorage.removeItem('hunta_session_token');
          
          // Reset state
          setUser(null);
          setManagedWallet(null);
          setSessionToken(null);
        }
      } else {
        // No saved session, ensure clean state
        console.log('No saved session found');
        localStorage.removeItem('hunta_user');
        localStorage.removeItem('hunta_managed_wallet');
        localStorage.removeItem('hunta_session_token');
        
        setUser(null);
        setManagedWallet(null);
        setSessionToken(null);
      }
      
      // Always set initializing to false after checking session
      setIsInitializing(false);
    };

    checkExistingSession();
  }, []);

  const connectWallet = async () => {
    if (!stellarKit) {
      setError('Wallet kit not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowModal(true);

    try {
      await stellarKit.openModal({
        onWalletSelected: async (selectedWallet: ISupportedWallet) => {
          try {
            // Set the selected wallet
            stellarKit.setWallet(selectedWallet.id);
            
            // Get the wallet address
            const { address } = await stellarKit.getAddress();
            
            // Connect to backend
            const response = await fetch('http://localhost:3001/api/auth/connect-wallet', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ publicKey: address }),
            });

            if (!response.ok) {
              throw new Error('Failed to connect wallet to backend');
            }

            const data = await response.json();
            
            if (data.success) {
              // Save to state and localStorage
              setUser(data.user);
              setManagedWallet(data.managedWallet);
              setSessionToken(data.token);
              
              localStorage.setItem('hunta_user', JSON.stringify(data.user));
              localStorage.setItem('hunta_managed_wallet', JSON.stringify(data.managedWallet));
              localStorage.setItem('hunta_session_token', data.token);

              console.log('Connected wallet:', data);
              
              // If managed wallet is null, it might be getting created
              if (!data.managedWallet) {
                console.warn('Managed wallet is null - this might indicate an issue');
              }
            } else {
              throw new Error(data.error || 'Failed to connect wallet');
            }

            // Close the modal after successful connection
            setShowModal(false);

          } catch (err) {
            console.error('Failed to connect wallet:', err);
            setError('Failed to connect wallet. Please try again.');
            setShowModal(false);
          }
        },
        onClosed: (err: Error) => {
          setShowModal(false);
          if (err.message !== 'Modal closed') {
            setError('Wallet connection was cancelled');
          }
        },
        modalTitle: 'Connect Your Stellar Wallet',
        notAvailableText: 'Not Available',
      });
    } catch (err) {
      console.error('Failed to open wallet modal:', err);
      setError('Failed to open wallet selection');
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    // Call backend logout endpoint if we have a session token
    if (sessionToken) {
      try {
        await fetch('http://localhost:3001/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
      } catch (error) {
        console.error('Failed to logout on backend:', error);
      }
    }
    
    setUser(null);
    setManagedWallet(null);
    setSessionToken(null);
    localStorage.removeItem('hunta_user');
    localStorage.removeItem('hunta_managed_wallet');
    localStorage.removeItem('hunta_session_token');
    
    // Disconnect from Stellar Kit
    if (stellarKit) {
      stellarKit.disconnect();
    }
  };

  const forceReset = () => {
    console.log('Force resetting all session data');
    setUser(null);
    setManagedWallet(null);
    setSessionToken(null);
    localStorage.removeItem('hunta_user');
    localStorage.removeItem('hunta_managed_wallet');
    localStorage.removeItem('hunta_session_token');
    
    // Disconnect from Stellar Kit
    if (stellarKit) {
      stellarKit.disconnect();
    }
  };

  const value: AuthContextType = {
    user,
    managedWallet,
    sessionToken,
    connectWallet,
    disconnectWallet,
    forceReset,
    isLoading,
    isInitializing,
    error,
    stellarKit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 