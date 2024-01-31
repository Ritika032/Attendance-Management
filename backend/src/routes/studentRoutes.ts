import express from "express";
import { isPresent, getCounts } from "../controllers/studentControllers";

const router = express.Router();

router.route("/myCounts").get(getCounts);
router.route("/date").post(isPresent);
export default router;
