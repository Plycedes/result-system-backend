import { Router } from "express";
import {
  setResult,
  loginAdmin,
  logoutAdmin,
  changePassword,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginAdmin);

//secured routes
router.route("/logout").post(verifyJWT, logoutAdmin);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/setresult").post(verifyJWT, setResult);

export default router;
