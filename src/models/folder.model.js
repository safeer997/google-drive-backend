import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "File"
  }],
  path:{
    type:String,
    required:true,
  }
},{timestamps:true});

const Folder = mongoose.model("Folder", folderSchema);

export { Folder };
