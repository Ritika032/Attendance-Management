import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Attendance from "../models/attendanceModel";
import ErrorHandler from "../utils/errorHandler";

// redis
export const getCounts = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const studentId = req.user._id;

    // await redis.set("hello", "world");
    // const cashedValue = await redis.get();

    const totalAttendanceDays = await Attendance.countDocuments({
      student: studentId,
    });

    const presentDays = await Attendance.countDocuments({
      student: studentId,
      status: true,
    });

    const absentDays = totalAttendanceDays - presentDays;

    res.status(200).json({
      success: true,
      totalAttendanceDays,
      presentDays,
      absentDays,
    });
  }
);

export const isPresent = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const studentId = req.user._id;
    const date = new Date(req.body.date);

    if (!date) {
      return next(new ErrorHandler("Please provide date", 400));
    }

    const attendanceRecord = await Attendance.findOne({
      student: studentId,
      date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
    });

    let success, isPresent;
    if (attendanceRecord) {
      success = true;
      if (attendanceRecord.status) {
        isPresent = true;
      } else {
        isPresent = false;
      }
    } else {
      success = false;
    }

    res.status(200).json({
      success: success,
      isPresent: isPresent,
    });
  }
);
