import { Router } from "express";
import healthRoutes from "./modules/health/health.routes";
import userRoutes from "./modules/user/user.routes";
import { auth } from "./config/auth";
import { toNodeHandler } from "better-auth/node";

const router = Router();

router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/auth", toNodeHandler(auth));
export default router;
