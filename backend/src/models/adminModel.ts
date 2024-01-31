import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const adminSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: [true, "Email already registered"],
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  number: {
    type: Number,
    required: [true, "Please enter your mobile number"],
    maxLength: [10, "Mobile number should be of 10 digits"],
    minLength: [10, "Mobile number should be of 10 digits"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  type: {
    type: String,
    default: "Admin",
  },
  qrHash: String,
  deviceHash: String,
  createdAT: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// // JWT TOKEN
adminSchema.methods.getJWTToken = function () {
  const object = { id: this._id, hash: this.deviceHash };
  //@ts-ignore
  return jwt.sign(object, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// // Compare Password

adminSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// // Generating Password Reset Token
adminSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
adminSchema.methods.getQRHash = function () {
  const hash = crypto
    .createHash("sha256")
    .update(crypto.randomBytes(20).toString("hex"))
    .digest("hex");

  this.qrHash = hash;

  return hash;
};

export default mongoose.model("Admin", adminSchema);
