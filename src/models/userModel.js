const mongoose = require("mongoose");

const Validator = require("../utils/validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: Validator.validatePhone,
        message: "Please enter a valid phone number",
        isAsync: false,
      },
      match: [Validator.phoneRegex, "Please enter a valid phone number"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: Validator.validateEmail,
        message: "Please enter a valid email address",
        isAsync: false,
      },
      match: [Validator.emailRegex, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    verified:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
