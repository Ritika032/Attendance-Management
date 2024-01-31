import { NextFunction, Request, Response } from "express";
import ErrorHander from "../utils/errorHandler";
import catchAsyncErrors from "./catchAsyncErrors";
import jwt from "jsonwebtoken";
import Student from "../models/studentModel";
import Admin from "../models/adminModel";

export const isAuthenticatedUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHander("Please Login to access this resource", 401));
    }

    // @ts-ignore
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // this method verify the signatue that is generated using the jwt secret(payload is not compared)

    const student = await Student.findById(decodedData.id);

    if (student) {
      // @ts-ignore
      req.user = student;
    } else {
      const admin = await Admin.findById(decodedData.id);
      if (!admin) {
        return next(
          new ErrorHander("Please Login to access this resource", 401)
        );
      }
      // @ts-ignore
      req.user = admin; // populates the req.user property
    }
    next();
  }
);

export const authorizeRoles = (...types: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    if (!types.includes(req.user.type)) {
      return next(
        new ErrorHander(
          //@ts-ignore
          `Role: ${req.user.type} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
