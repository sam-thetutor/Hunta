import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import ManagedWallet from '../models/ManagedWallet.js';
import Session from '../models/Session.js';
import { generateWallet, encryptSecretKey, fundTestWallet } from '../utils/stellar.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || '12389389';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12389389';

console.log("JWT_SECRET", JWT_SECRET);
console.log("ENCRYPTION_KEY", ENCRYPTION_KEY);

// Connect wallet and create session
router.post('/connect-wallet', async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'Public key is required' });
    }

    // Find or create user
    let user = await User.findOne({ publicKey });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        publicKey,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      await user.save();
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    // Create managed wallet for new users or if it doesn't exist
    let managedWallet = null;
    
    // First, try to find existing managed wallet
    managedWallet = await ManagedWallet.findOne({ userId: user._id });
    
    // If no managed wallet exists, create one
    if (!managedWallet) {
      console.log('Creating new managed wallet for user:', user.publicKey);
      const walletInfo = generateWallet();
      const encryptedSecretKey = encryptSecretKey(walletInfo.secretKey, ENCRYPTION_KEY);
      
      managedWallet = new ManagedWallet({
        userId: user._id,
        walletName: 'Agent Managed Wallet',
        publicKey: walletInfo.publicKey,
        secretKey: encryptedSecretKey,
        walletType: 'agent_managed',
        createdAt: new Date(),
        lastUsed: new Date()
      });
      await managedWallet.save();

      // Fund the test wallet
      try {
        await fundTestWallet(walletInfo.publicKey);
        console.log('Funded test wallet:', walletInfo.publicKey);
      } catch (fundError) {
        console.error('Failed to fund test wallet:', fundError);
        // Don't fail the request if funding fails
      }
    } else {
      console.log('Found existing managed wallet for user:', user.publicKey);
    }

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const session = new Session({
      userId: user._id,
      sessionToken,
      expiresAt,
      createdAt: new Date()
    });
    await session.save();

    // Generate JWT token
    const token = jwt.sign({ sessionToken }, JWT_SECRET, { expiresIn: '24h' });

    const response = {
      success: true,
      token,
      user: {
        id: user._id,
        publicKey: user.publicKey,
        isNewUser
      },
      managedWallet: managedWallet ? {
        id: managedWallet._id,
        publicKey: managedWallet.publicKey,
        walletName: managedWallet.walletName,
        walletType: managedWallet.walletType
      } : null
    };

    console.log('Wallet connection response:', {
      userId: user._id,
      userPublicKey: user.publicKey,
      hasManagedWallet: !!managedWallet,
      managedWalletPublicKey: managedWallet?.publicKey
    });

    res.json(response);

  } catch (error) {
    console.error('Error connecting wallet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile with wallet info
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { sessionToken: string };
    
    const session = await Session.findOne({ 
      sessionToken: decoded.sessionToken,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const user = await User.findById(session.userId);
    const managedWallet = await ManagedWallet.findOne({ userId: session.userId });

    res.json({
      user: {
        id: user?._id,
        publicKey: user?.publicKey,
        createdAt: user?.createdAt,
        lastLogin: user?.lastLogin
      },
      managedWallet: managedWallet ? {
        id: managedWallet._id,
        publicKey: managedWallet.publicKey,
        walletName: managedWallet.walletName,
        walletType: managedWallet.walletType,
        createdAt: managedWallet.createdAt
      } : null
    });

  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (invalidate session)
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { sessionToken: string };
    
    await Session.deleteOne({ sessionToken: decoded.sessionToken });

    res.json({ success: true, message: 'Logged out successfully' });

  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug endpoint to check token validity
router.get('/debug-token', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as unknown as { sessionToken: string };
      
      const session = await Session.findOne({ 
        sessionToken: decoded.sessionToken,
        expiresAt: { $gt: new Date() }
      });

      if (!session) {
        return res.status(401).json({ 
          error: 'Session not found or expired',
          decoded: decoded,
          sessionExists: false
        });
      }

      res.json({
        valid: true,
        decoded: decoded,
        session: {
          id: session._id,
          userId: session.userId,
          expiresAt: session.expiresAt,
          createdAt: session.createdAt
        }
      });

    } catch (jwtError) {
      res.status(401).json({ 
        error: 'Invalid JWT token',
        jwtError: jwtError instanceof Error ? jwtError.message : 'Unknown JWT error'
      });
    }

  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 