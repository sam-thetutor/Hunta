import mongoose, { Document, Schema } from 'mongoose';

export interface IManagedWallet extends Document {
  userId: mongoose.Types.ObjectId;
  walletName: string;
  publicKey: string;
  secretKey: string; // Encrypted private key
  walletType: 'agent_managed' | 'user_connected';
  createdAt: Date;
  lastUsed: Date;
}

const ManagedWalletSchema = new Schema<IManagedWallet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletName: {
    type: String,
    required: true,
    default: 'Agent Managed Wallet'
  },
  publicKey: {
    type: String,
    required: true,
    unique: true
  },
  secretKey: {
    type: String,
    required: true
  },
  walletType: {
    type: String,
    enum: ['agent_managed', 'user_connected'],
    default: 'agent_managed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IManagedWallet>('ManagedWallet', ManagedWalletSchema); 