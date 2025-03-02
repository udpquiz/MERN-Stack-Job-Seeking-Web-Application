import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name."],
    minLength: [3, "Name must contain at least 3 characters!"],
    maxLength: [50, "Name cannot exceed 50 characters!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email."],
    match: [
      /^\S+@\S+\.\S+$/,
      "Please enter a valid email address.",
    ],
  },
  message: {
    type: String,
    required: [true, "Please provide your feedback message."],
    minLength: [10, "Feedback must contain at least 10 characters!"],
    maxLength: [500, "Feedback cannot exceed 500 characters!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
