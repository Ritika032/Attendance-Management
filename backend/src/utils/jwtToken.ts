// Create Token and saving in cookie

import { Response } from "express";

const sendToken = (user: any, statusCode: number, res: Response) => {
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    sameSite: "none",
    secure: true,
    expires: new Date(
      //@ts-ignore
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //@ts-ignore
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
