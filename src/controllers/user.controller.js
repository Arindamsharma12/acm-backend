import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId)=>{
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log(req.body);
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400,"All Fields are required")
  }
  const existedUser = await User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409,"User with username or email already exists")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
  }
  // if(!avatarLocalPath){
  //   throw new ApiError(400,"Avatar file is required")
  // }

  const avtar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  console.log(avtar)
  // if(!avtar){
  //   throw new ApiError(400,"Avatar file is required")
  // }
  const user = await User.create({
    fullName,
    avatar:avtar?.url || "",
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })
  

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering a user")
  }
  return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully")
  )
});

const loginUser = asyncHandler(async (req,res)=>{
  const {username,email,password} = req.body
  if(!username && !email){
    throw new ApiError(400,"Username or email is required")
  }
  const user = await User.findOne(
    {
      $or:[{username},{email}]
    }
  )
  if(!user){
    throw new ApiError(404,"User does not exist")
  }
  const isPasswordValid = await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials")
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
  
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  const options = {
    httOnly:true,
    secure:true,
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,{
      user:loggedInUser,accessToken,refreshToken
    },
    "User Logged in Successfully"
  )
  )
})

const logoutUser = asyncHandler(async (req,res)=>{
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      }
    },
    {
      new:true
    }
  )
  const options = {
    httOnly:true,
    secure:true,
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logged Out"))
})

export {
  registerUser,
  loginUser,
  logoutUser
}

