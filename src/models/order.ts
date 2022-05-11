import { IOrder } from '@/interfaces/IOrder';
import mongoose from 'mongoose';

const Order = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    amount: {
        type: Number,
        required: true,
    },

    address: {
        type: Object,
        required: true,
    },

    status: {
        type: String,
        required: true,
        enum: ["pending", "paid", "intransit", "delivered"],
        default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IOrder & mongoose.Document>('Order', Order);
