import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import sendToken from "../utils/jwtToken";
import Admin from "../models/adminModel";
import Student from "../models/studentModel";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";

export const login = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, hash } = req.body;

    if (!hash) {
      return next(new ErrorHandler("Device not supported", 400));
    }
    // checking if user has given password and email both

    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    let user;
    const admin = await Admin.findOne({ email }).select("+password");
    if (admin) {
      user = admin;
    } else {
      const student = await Student.findOne({ email }).select("+password");
      if (!student) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      user = student;
    }

    //@ts-ignore
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    user.deviceHash = hash;
    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);
  }
);
export const logout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  }
);

export const forgotPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let user;
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      user = admin;
    } else {
      const student = await Student.findOne({ email: req.body.email });
      if (!student) {
        return next(new ErrorHandler("User not found", 404));
      }
      user = student;
    }

    // Get ResetPassword Token
    //@ts-ignore
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetToken} \n\nIf you have not requested this email then, please ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const resetPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");

    let user;
    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (admin) {
      user = admin;
    } else {
      const student = await Student.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!student) {
        return next(
          new ErrorHandler(
            "Reset Password Token is invalid or has been expired",
            400
          )
        );
      }
      user = student;
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("Password does not match confirmPassword", 400)
      );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  }
);
