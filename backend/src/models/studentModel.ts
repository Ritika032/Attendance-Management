import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const studentSchema = new Schema({
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
    default: "Student",
  },
  rollNumber: {
    type: Number,
    unique: true,
  },
  deviceHash: String,
  createdAT: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// ye method har bar save hone se pehle chalegi
studentSchema.pre("save", async function (next) {
  // agr changes hai to password ko hash krke save kro
  if (!this.isModified("password")) {
    // ye condition isliye kyunki hashing intensive hai and har bar nhi krna
    next();
  }
  this.password = await bcrypt.hash(this.password, 10); // hashes cannot be converted backwards
  //@ts-ignore
  const lastDocument = await this.constructor.findOne().sort({ _id: -1 });
  this.rollNumber = lastDocument.rollNumber + 1;
});

// // JWT TOKEN
studentSchema.methods.getJWTToken = function () {
  const object = { id: this._id, hash: this.deviceHash };
  //@ts-ignore
  return jwt.sign(object, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // create a jwt token with _id and deviceHash
  });
};

// // Compare Password

studentSchema.methods.comparePassword = async function (password: string) {
  // compare method password ka hash bana ke this.password ke hash se compare krti hai
  return await bcrypt.compare(password, this.password);
};

// // Generating Password Reset Token
studentSchema.methods.getResetPasswordToken = function () {
  // Generating random data
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("Student", studentSchema);
