import { Router } from "express";
import {
  createFile,
  getFiles,
  renameFile,
  deleteFile,
  updateIconColor,
} from "../controllers/file.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// File routes
router.route("/files").post(upload.single("file"), createFile);

router.route("/files").get(getFiles);

router.route("/files/:id").delete(deleteFile);

router.route("/files/:id").put(renameFile);

router.route("/files/color/:id").put(updateIconColor);

export default router;
