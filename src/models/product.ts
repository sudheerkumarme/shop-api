import { IProduct } from '@/interfaces/IProduct';
import mongoose from 'mongoose';

const Product = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a title'],
      unique: true,
    },

    desc: {
      type: String,
      required: [true, 'Please enter description'],
    },

    img: {
      type: String,
      required: true,
    },

    categories: {
      type: Array,
    },

    size: {
      type: Array,
    },

    color: {
      type: Array,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct & mongoose.Document>('Product', Product);
