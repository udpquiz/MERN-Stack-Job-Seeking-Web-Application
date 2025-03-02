import express from "express";
import {
    adminGetAllFeedback,
    adminDeleteFeedback,
    postFeedback,
    submitFeedback,
    /* ADD THIS IMPORT: */ updateFeedback
} from "../controllers/feedbackController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// --- Optional: User Feedback Route ---
router.post("/submit", isAuthenticated, submitFeedback);

// --- Admin Feedback Routes ---
router.get("/admin/feedback", isAuthenticated, adminGetAllFeedback);
router.delete("/admin/delete/:id", isAuthenticated, adminDeleteFeedback);
router.put("/update/:id", isAuthenticated, updateFeedback); // ADD THIS LINE - Feedback Update Route (Admin can use this)

export default router;