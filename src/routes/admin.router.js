import { Router } from "express";
import { setResult } from "../controllers/admin.controller.js";

const router = Router();

router.route("/setresult").post(setResult);

export default router;
