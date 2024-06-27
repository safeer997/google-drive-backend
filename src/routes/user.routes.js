import { Router } from "express";

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

// File routes
router.route("/files").post(upload.single("file"), createFile);

router.route("/files").get(getFiles);

router.route("/files/:id").get(getFileById).delete(deleteFile);

router.route("/files/:id").put(updateFile);

router.route("/files/color/:id").put(updateIconColor);

export default router;
