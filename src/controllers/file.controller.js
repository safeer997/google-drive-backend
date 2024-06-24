import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import fs from "fs";

// Create a new file
const createFile = asyncHandler(async (req, res) => {
  
  const { folderId } = req.body;
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "File is required");
  }

  const newFile = await File.create({
    name: file.originalname,
    path: file.path,
    size: file.size,
  });

  if (folderId) {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      throw new ApiError(404, "Folder not found");
    }
    folder.files.push(newFile._id);
    await folder.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newFile, "File created successfully"));
});

// Get a specific file
const getFileById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const file = await File.findById(id);
  if (!file) {
    throw new ApiError(404, "File not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, file, "File fetched successfully"));
});

// Update a file
const updateFile = asyncHandler(async (req, res) => {
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

// Delete a file
const deleteFile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const file = await File.findById(id);
  if (!file) {
    throw new ApiError(404, "File not found");
  }

  // Check if the file exists on the filesystem before attempting to delete it
  if (fs.existsSync(file.path)) {
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      throw new ApiError(500, "Error deleting the file from the filesystem");
    }
  } else {
    throw new ApiError(404, "File not found on the filesystem");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "File deleted successfully"));
});

export { createFile, getFileById, updateFile, deleteFile };
