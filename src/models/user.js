const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter username'],
      unique: true,
    },

    email: {
      type: String,
      required: [true, 'Please enter email'],
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'Please enter a password'],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = {
  UserSchema: UserSchema,
  User: mongoose.model("User", UserSchema),
}
