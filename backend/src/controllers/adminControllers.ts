import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import ApiFeatures from "../utils/apiFeatures";
import Student from "../models/studentModel";
import Attendance from "../models/attendanceModel";
import ErrorHandler from "../utils/errorHandler";

export const getTodaysCounts = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalStudentsCount = await Student.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const date = new Date();
    // Get present students count
    const presentStudentsCount = await Attendance.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
      status: true,
    });

    // Get absent students count
    const absentStudentsCount = totalStudentsCount - presentStudentsCount;

    res.status(200).json({
      success: true,
      totalStudentsCount,
      presentStudentsCount,
      absentStudentsCount,
    });
  }
);

// redis
export const getAllStudents = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentPage = Number(req.query.page) || 1;

    const resultPerPage = 5;

    const skip = resultPerPage * (currentPage - 1);

    const students = await Student.find().limit(resultPerPage).skip(skip);
    const studentCount = students.length;

    res.status(200).json({
      success: true,
      resultPerPage,
      studentCount,
      students,
    });
  }
);

export const searchStudent = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const word = req.body.word;
    if (!word) {
      return next(new ErrorHandler("Enter the word to be searched", 400));
    }

    // const cashedValue = await redis.get(word);

    const student = await Student.find({ name: word });

    res.json({
      success: true,
      student,
    });
  }
);

export const attendanceRecord = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const date = new Date(req.query.date);

    if (!date) {
      return next(new ErrorHandler("Please provide date", 400));
    }

    const attendanceList = await Attendance.find({
      date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
    }).populate("student", "name rollNumber email");
    const length = attendanceList.length;
    res.status(200).json({
      success: true,
      length,
      attendanceList,
    });
  }
);
