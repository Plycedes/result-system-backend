import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Result } from "../models/result.model.js";
import { Admin } from "../models/admin.model.js";

const generateAccessTokenAndRefreshToken = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens."
    );
  }
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    throw new ApiError(400, "username and password are required");
  }

  const admin = await Admin.findOne({
    $or: [{ username }],
  });

  if (!admin) {
    throw new ApiError(404, "Admin not registered");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(admin._id);

  const loggedInAdmin = await Admin.findById(admin._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInAdmin,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByInAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Admin loggedout successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "Old or New Password missing");
  }

  const admin = await Admin.findById(req.user?._id);
  const isPasswordValid = await admin.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  admin.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

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

export { setResult, loginAdmin, logoutAdmin, changePassword };
