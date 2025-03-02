import express from "express";
import {
    employerGetAllApplications,
    jobseekerDeleteApplication,
    jobseekerGetAllApplications,
    postApplication,
    adminGetAllApplications,
    adminDeleteApplication,
    /* ADD THIS IMPORT: */ updateApplication
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);

// --- Admin Application Routes ---
router.get("/admin/applications", isAuthenticated, adminGetAllApplications);
router.delete("/admin/delete/:id", isAuthenticated, adminDeleteApplication);
router.put("/update/:id", isAuthenticated, updateApplication); // ADD THIS LINE - Application Update Route

export default router;