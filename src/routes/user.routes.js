import { Router } from "express";

import { createFolder, getFolders, getFolderById, updateFolder, deleteFolder } from "../controllers/folder.controller.js";
import { createFile, getFileById, updateFile, deleteFile } from "../controllers/file.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Folder routes
router.route("/folders").post(createFolder).get(getFolders);
router.route("/folders/:id").get(getFolderById).put(updateFolder).delete(deleteFolder);

// File routes
router.route("/files").post(upload.single('file'), createFile);
router.route("/files/:id").get(getFileById).put(updateFile).delete(deleteFile);

export default router;
