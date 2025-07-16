import mongoose, { Document, Schema } from 'mongoose';

export interface ISwap extends Document {
  userId: mongoose.Types.ObjectId;
  managedWalletId: mongoose.Types.ObjectId;
  hash: string;
  status: 'pending' | 'completed' | 'failed';
  inputToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  outputToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  inputAmount: string;
  outputAmount: string;
  priceImpact: string;
  fee: string;
  slippageTolerance: number;
  route: any[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const SwapSchema = new Schema<ISwap>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  managedWalletId: {
    type: Schema.Types.ObjectId,
    ref: 'ManagedWallet',
    required: true
  },
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  inputToken: {
    address: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    decimals: { type: Number, required: true }
  },
  outputToken: {
    address: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    decimals: { type: Number, required: true }
  },
  inputAmount: {
    type: String,
    required: true
  },
  outputAmount: {
    type: String,
    required: true
  },
  priceImpact: {
    type: String,
    required: true
  },
  fee: {
    type: String,
    required: true
  },
  slippageTolerance: {
    type: Number,
    required: true,
    default: 0.5
  },
  route: {
    type: [Schema.Types.Mixed],
    required: true
  } as any,
  error: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Update the updatedAt field before saving
SwapSchema.pre('save', function(next) {
  (this as any).updatedAt = new Date();
  next();
});

// Index for efficient queries
SwapSchema.index({ userId: 1, createdAt: -1 });
SwapSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<ISwap>('Swap', SwapSchema); 