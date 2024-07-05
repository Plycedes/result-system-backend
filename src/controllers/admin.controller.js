import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Result } from "../models/result.model.js";

const setResult = asyncHandler(async (req, res) => {
  //   res.status(200).json({
  //     message: "Set Result",
  //   });

  const { mobileno, name, rollno, math, physics, chemistry, biology, english } =
    req.body;

  if (
    [mobileno, name, rollno, math, physics, chemistry, biology, english].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "No field can be empty");
  }

  const existingResult = await Result.findOne({
    $or: [{ rollno }],
  });

  if (existingResult) {
    throw new ApiError(409, "Result already exists");
  }

  const result = await Result.create({
    mobileno,
    name,
    rollno,
    math,
    physics,
    chemistry,
    biology,
    english,
  });

  const resultAdded = await Result.findById(result._id).select("-mobileno");

  if (!resultAdded) {
    throw new ApiError(500, "Something went wrong while adding result");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, resultAdded, "Result Added Successfully"));
});

export { setResult };
