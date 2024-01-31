import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cookeiParser from "cookie-parser";
import bodyParser from "body-parser";
import auth from "./routes/authRoutes";
import admin from "./routes/adminRoutes";
import student from "./routes/studentRoutes";
import qr from "./routes/qrCodeRoutes";
import path from "path";
import errorMiddleware from "./middlewares/error";
import attendanceModel from "./models/attendanceModel";
import { authorizeRoles, isAuthenticatedUser } from "./middlewares/auth";
//@ts-ignore
import cors from "cors";

const app: Express = express();
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(cookeiParser());
app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/", async (req, res) => {
//   const studentId = req.body.studentId;
//   const present = true;
//   const admin = await attendanceModel.create({
//     student: studentId,
//     status: present,
//   });

//   res.json({
//     success: true,
//     admin,
//   });
// });

app.use("/api/v1", auth);
app.use("/api/v1/admin", isAuthenticatedUser, authorizeRoles("Admin"), admin);
app.use(
  "/api/v1/student",
  isAuthenticatedUser,
  authorizeRoles("Student"),
  student
);
app.use("/api/v1/qr", qr);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/build/index.html"));
});

app.use(errorMiddleware);

export default app;
