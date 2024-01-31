import express from "express";
import { getQR, scanQR } from "../controllers/qrCodeControllers";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

router.route("/get").get(isAuthenticatedUser, authorizeRoles("Admin"), getQR);
router
  .route("/scan")
  .post(isAuthenticatedUser, authorizeRoles("Student"), scanQR);

export default router;
