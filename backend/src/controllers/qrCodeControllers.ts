import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import attendanceModel from "../models/attendanceModel";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import adminModel from "../models/adminModel";

export const getQR = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = await adminModel.findOne();
    if (!admin) return next(new ErrorHandler("admin login kro", 400));

    //@ts-ignore
    const hash = admin.getQRHash();
    await admin.save({ validateBeforeSave: false });

    res.json({
      success: true,
      hash,
    });
  }
);

export const scanQR = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const studentId = req.user._id;
    const { hash } = req.body;
    if (!hash) {
      return next(
        new ErrorHandler("Qr not scanned unable to get the hash", 400)
      );
    }

    const admin = await adminModel.findOne();
    //@ts-ignore
    if (hash !== admin.qrHash) {
      return next(new ErrorHandler("This QR code has expired", 400));
    }
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const date = new Date();

    const attendance = await attendanceModel.findOne({
      student: studentId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // console.log(attendance);
    // if already marked

    if (attendance && attendance.status) {
      return res.json({
        success: false,
      });
    }

    await attendanceModel.create({
      student: studentId,
      status: true,
    });

    res.json({
      success: true,
    });
  }
);
