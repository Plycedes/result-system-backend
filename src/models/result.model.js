import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
  {
    mobileno: {
      type: Number,
      required: true,
      unique: true,
    },
    rollno: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    math: {
      type: Number,
      required: true,
    },
    physics: {
      type: Number,
      required: true,
    },
    chemistry: {
      type: Number,
      required: true,
    },
    biology: {
      type: Number,
      required: true,
    },
    english: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Result = mongoose.model("Result", resultSchema);
