import { Keypair } from '@stellar/stellar-sdk';
import crypto from 'crypto';

// For now, we'll use a simple approach without the Server class
// We can implement balance checking via direct API calls

export interface WalletInfo {
  publicKey: string;
  secretKey: string;
}

export const generateWallet = (): WalletInfo => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  };
};

export const encryptSecretKey = (secretKey: string, encryptionKey: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(secretKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decryptSecretKey = (encryptedSecretKey: string, encryptionKey: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  
  const [ivHex, encrypted] = encryptedSecretKey.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

export const getWalletBalance = async (publicKey: string): Promise<{ asset: string; balance: string }[]> => {
  try {
    const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch account: ${response.status} ${response.statusText}`);
    }
    
    const account = await response.json();
    console.log("account data:", account);
    
    if (!account.balances) {
      console.log("No balances found in account data");
      return [];
    }
    
    return account.balances.map((balance: any) => ({
      asset: balance.asset_type === 'native' ? 'XLM' : balance.asset_code,
      balance: balance.balance
    }));
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return [];
  }
};

export const fundTestWallet = async (publicKey: string): Promise<boolean> => {
  try {
    // For testnet, you can use the friendbot to fund accounts
    const response = await fetch(`https://friendbot.stellar.org/?addr=${publicKey}`);
    if (response.ok) {
      console.log(`Funded test wallet: ${publicKey}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error funding test wallet:', error);
    return false;
  }
}; 