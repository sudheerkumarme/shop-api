import { ICart } from '@/interfaces/ICart';
import mongoose from 'mongoose';

const Cart = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    products: [
      {
        _id: false,
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<ICart & mongoose.Document>('Cart', Cart);
