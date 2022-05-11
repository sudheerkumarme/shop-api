import { IUser } from '@/interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter name'],
    },

    email: {
      type: String,
      required: [true, 'Please enter email'],
      lowercase: true,
      unique: true,
    },

    password: String,

    salt: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: 'user',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
