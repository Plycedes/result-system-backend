import { Router } from "express";
import { getResult } from "../controllers/result.controller.js";

const router = Router();

router.route("/getresult").post(getResult);

export default router;
