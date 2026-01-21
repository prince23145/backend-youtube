import { asynchandler } from "../utilis/asynchandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utilis/cloudinary.js";
import { ApiResponse } from "../utilis/ApiResponse.js";

const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while genreating refresh and acces token",
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  if (
    [username, email, fullName, password].some((feild) => feild?.trim() === "")
  ) {
    throw new ApiError(400, "all feilds are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "username or email is already existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(410, "avatar files is requireeeeed");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is requireddddddd");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asynchandler(async (req, res) => {
  //  req body
  // username or email
  // find the user
  // asses and refresh token
  //send cokkie

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "enter email or username");
  }
  const userfind = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!userfind) {
    throw new ApiError(404, "user  not found");
  }

  const isPasswordValid = await userfind.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshTokens(userfind._id);

  const isLoggedIn = await User.findById(userfind._id).select(
    "-password -refreshToken",
  );

  const Options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("refreshToken", refreshToken, Options)
    .cookie("accessToken", accessToken, Options)
  .json({
    status: 200,
    data: {
      user: isLoggedIn,
      accessToken,
      refreshToken,
    },
    message: "User logged in successfully",
  });
});

const logoutUser = asynchandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logout User"));
});

export { registerUser, loginUser, logoutUser };
