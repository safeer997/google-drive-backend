import { Router } from "express";
import {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} from "../controllers/folder.controller.js";
import {
  createFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  updateIconColor,
} from "../controllers/file.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Folder routes
router.route("/folders").post(createFolder);
router.route("/folders").get(getFolders);
router.route("/folders/:id").get(getFolderById);
router.route("/folders/:id").put(updateFolder);
router.route("/folders/:id").delete(deleteFolder);

// File routes
router.route("/files").post(upload.single("file"), createFile);

router.route("/files").get(getFiles);

router.route("/files/:id").get(getFileById).delete(deleteFile);

router.route("/files/:id").put(updateFile);

router.route("/files/color/:id").put(updateIconColor);

export default router;
