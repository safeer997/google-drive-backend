import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subfolders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  { timestamps: true }
);

export const Folder = mongoose.model("Folder", folderSchema);
