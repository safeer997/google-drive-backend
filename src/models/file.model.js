import mongoose from "mongoose";

const { Schema } = mongoose;

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path:{
    type:String,
    required:true,
  }
},{timestamps:true});

const File = mongoose.model("File", fileSchema);

export { File };
