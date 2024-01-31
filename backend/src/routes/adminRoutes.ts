import express from "express";
import {
  attendanceRecord,
  getAllStudents,
  getTodaysCounts,
  searchStudent,
} from "../controllers/adminControllers";

const router = express.Router();

router.route("/todaysCounts").get(getTodaysCounts);

router.route("/students").get(getAllStudents);

router.route("/search").post(searchStudent);

router.route("/day").post(attendanceRecord);

export default router;
