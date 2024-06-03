import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req, res) => {
  //1 - get video details - title,description
  //2 - validation - at least not empty
  //3 - upload videofile and thumbnail using multer
  //4 - upoad them to cloudinary : check whtether files uploaded or not
  //4.5 - get duration from cloudinary
  //5 - create video object i:e create entry in db
  //6 - check video document updated in db
  // 7 -return response

  //step 1-2
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Field are required");
  }

  //step 3

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!(videoFileLocalPath || thumbnailLocalPath)) {
    throw new ApiError(400, "VideoFile and Thumbnail are required.");
  }

  //step 4

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(500, "failed to upload videofile on cloudinary");
  }

  if (!thumbnail) {
    throw new ApiError(500, "failed to upload thumbnail on cloudinary");
  }

  //step 4.5

  const videoFileDuration = videoFile.duration;

  //steps to find owner name
  //we have id of user , if we match user id in users and from there we can extract the user name

  // const userDocument = await User.aggregate([
  //   {
  //     $match:{
  //       _id: new mongoose.Types.ObjectId(req.user._id)
  //     }
  //   }
  // ])

  // const ownerName = userDocument[0].username
  // console.log("owner name is :",ownerName);
  // console.log(typeof(ownerName));

  //step 5
  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFileDuration,
    owner: req.user._id,
  });

  //step 6

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(500, "something went wrong while updating video in db ");
  }

  //step 7
  return res
    .status(200)
    .json(new ApiResponse(200, createdVideo, "Video uploaded Successfully ."));
});

const deletevideo = asyncHandler(async (req, res) => {
  //get a video id
  //check if video exists
  //check if video is uploaded by requesting user
  //delete the video from db
  //delete from cloudinary
  //return response

  const { videoId } = req.body;
  console.log(videoId);


  if (!videoId) {
    throw new ApiError(400, "please provide a video to delete");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "No video found for provided videoId in db");
  }

  const user = await User.findById(req.user?._id);
  
  const userId = user._Id;

  if (video.owner !== userId) {
    throw new ApiError(
      401,
      "you are not authorized to delete this video as you dont own it"
    );
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

export { uploadVideo, deletevideo };
