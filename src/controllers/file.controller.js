import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { File } from "../models/file.model.js";
import fs from "fs";

//fn to create new file
const createFile = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "File is required");
  }

  const newFile = await File.create({
    name: file.originalname,
    size: file.size,
    path: file.path,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newFile, "File created successfully"));
});

//fn to get all files
const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find();
  return res
    .status(200)
    .json(new ApiResponse(200, files, "Files fetched successfully"));
});

//fn to rename 
const renameFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "File name is required");
  }

  const updatedFile = await File.findByIdAndUpdate(id, { name }, { new: true });
  if (!updatedFile) {
    throw new ApiError(404, "File not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFile, "File updated successfully"));
});


//fn to change iconColor
const updateIconColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { color } = req.body;

  if (!color) {
    throw new ApiError(400, "color is required");
  }

  const updatedFile = await File.findByIdAndUpdate(
    id,
    { color },
    { new: true }
  );

  if (!updatedFile) {
    throw new ApiError(404, "File not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFile, "Color updated successfully"));
});

//fn to delete file
const deleteFile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const file = await File.findById(id);
  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (fs.existsSync(file.path)) {
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      throw new ApiError(500, "Error deleting the file from the filesystem");
    }
  }

  await File.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "File deleted successfully"));
});

export {
  createFile,
  getFiles,
  renameFile,
  deleteFile,
  updateIconColor,
};
