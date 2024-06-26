import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Folder } from "../models/folder.model.js";

const createFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Folder name is required");
  }

  const newFolder = await Folder.create({
    name,
    files: [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newFolder, "Folder created successfully"));
});

const getFolders = asyncHandler(async (req, res) => {
  const folders = await Folder.find();
  return res
    .status(200)
    .json(new ApiResponse(200, folders, "Folders fetched successfully"));
});

const getFolderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const folder = await Folder.findById(id);
  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, folder, "Folder fetched successfully"));
});

const updateFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Folder name is required");
  }

  const updatedFolder = await Folder.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  if (!updatedFolder) {
    throw new ApiError(404, "Folder not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFolder, "Folder updated successfully"));
});

const deleteFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const folder = await Folder.findById(id);
  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  await Folder.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Folder deleted successfully"));
});

export { createFolder, getFolders, getFolderById, updateFolder, deleteFolder };
