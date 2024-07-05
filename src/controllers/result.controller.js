import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Result } from "../models/result.model.js";

const setResult = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "I love Jagriti",
  });
});

const getResult = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "I love Jagriti",
  });
});

export { getResult };
