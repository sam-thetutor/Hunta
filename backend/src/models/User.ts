import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  publicKey: string;
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema = new Schema<IUser>({
  publicKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IUser>('User', UserSchema); 