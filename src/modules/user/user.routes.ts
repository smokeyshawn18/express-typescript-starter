import { Router } from "express";
import {
  getMe,
  getUsers,
  requestOtp,
  updateMe,
  verifyOtp,
} from "./user.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/otp/send", requestOtp);
router.post("/otp/verify", verifyOtp);
router.get("/", getUsers);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);

export default router;
