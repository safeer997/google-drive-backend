import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Folder } from "../models/folder.model.js";

// Create a new folder
const createFolder = asyncHandler(async (req, res) => {
  const { name, parentId } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Folder name is required");
  }

  const newFolder = await Folder.create({
    name,
    subfolders: [],
    files: []
  });

  if (parentId) {
    const parentFolder = await Folder.findById(parentId);
    if (!parentFolder) {
      throw new ApiError(404, "Parent folder not found");
    }
    parentFolder.subfolders.push(newFolder._id);
    await parentFolder.save();
  }

  return res
  .status(201)
  .json(new ApiResponse(201, newFolder, "Folder created successfully"));

});

// Get all folders
const getFolders = asyncHandler(async (req, res) => {
  const folders = await Folder.find().populate("subfolders").populate("files");
  return res
  .status(200)
  .json(new ApiResponse(200, folders, "Folders fetched successfully"));

});

// Get a specific folder
const getFolderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const folder = await Folder.findById(id).populate("subfolders").populate("files");
  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, folder, "Folder fetched successfully"));

});

// Update a folder
const updateFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Folder name is required");
  }

  const updatedFolder = await Folder.findByIdAndUpdate(id, { name }, { new: true });
  if (!updatedFolder) {
    throw new ApiError(404, "Folder not found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, updatedFolder, "Folder updated successfully"));

});

// Delete a folder
const deleteFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const folder = await Folder.findById(id);
  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  if (folder.subfolders.length > 0 || folder.files.length > 0) {
    throw new ApiError(400, "Folder is not empty");
  }

  await folder.remove();
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Folder deleted successfully"));
  
});

export { createFolder, getFolders, getFolderById, updateFolder, deleteFolder };
