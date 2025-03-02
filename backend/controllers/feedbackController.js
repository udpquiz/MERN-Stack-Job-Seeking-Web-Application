import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Feedback } from "../models/feedbackSchema.js"; // Assuming you have feedbackSchema.js

// --- Admin Feedback Management --- (No Role-Based Auth Anymore)
export const submitFeedback = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  await Feedback.create({ name, email, message });

  res.status(201).json({
    success: true,
    message: "Feedback submitted successfully!",
  });
});

// Admin: Get All Feedbacks
export const getAllFeedbacks = catchAsyncErrors(async (req, res, next) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    feedbacks,
  });
});
// Admin - Get All Feedback
export const adminGetAllFeedback = catchAsyncErrors(async (req, res, next) => {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        feedback,
    });
});

// Admin - Delete Feedback
export const adminDeleteFeedback = catchAsyncErrors(async (req, res, next) => {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
        return next(new ErrorHandler("Feedback not found!", 404));
    }
    await feedback.deleteOne();
    res.status(200).json({
        success: true,
        message: "Feedback Deleted Successfully!",
    });
});


// --- Optional: User Post Feedback ---
export const postFeedback = catchAsyncErrors(async (req, res, next) => {
    const { message } = req.body;
    if (!message) {
        return next(new ErrorHandler("Please provide feedback message.", 400));
    }
    const user = req.user._id; // Assuming feedback is associated with logged-in user
    const feedback = await Feedback.create({
        message,
        user,
    });
    res.status(200).json({
        success: true,
        message: "Feedback Submitted Successfully!",
        feedback,
    });
});

export const updateFeedback = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  let feedback = await Feedback.findById(id);
  if (!feedback) {
      return next(new ErrorHandler("Feedback not found.", 404));
  }

  feedback.message = message || feedback.message; // Update message

  await feedback.save({ validateBeforeSave: true }); // Re-validate before saving

  res.status(200).json({
      success: true,
      message: "Feedback Updated Successfully!",
  });
});