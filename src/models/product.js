const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
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
      type: String,
    },

    color: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = {
  ProductSchema: ProductSchema,
  Product: mongoose.model('Product', ProductSchema),
};
