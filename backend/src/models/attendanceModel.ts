import mongoose, { Schema } from "mongoose";
import validator from "validator";

const attendanceSchema = new Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "Student",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: false,
  },
  cretedAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("Attendance", attendanceSchema);
