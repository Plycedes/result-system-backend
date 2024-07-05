import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Result } from "../models/result.model.js";

const getResult = asyncHandler(async (req, res) => {
  const { rollno, mobileno } = req.body;

  if (!rollno || !mobileno) {
    throw new ApiError(400, "Both Mobile No and Roll No are required");
  }

  const result = await Result.findOne({
    $and: [{ mobileno }, { rollno }],
  });

  if (!result) {
    throw new ApiError(404, "Result does not exist");
  }

  return res.status(200).json(new ApiResponse(200, result, "Result found"));
});

export { getResult };
