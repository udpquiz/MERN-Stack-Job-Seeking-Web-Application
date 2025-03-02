import express from "express";
import {
    deleteJob,
    getAllJobs,
    getMyJobs,
    getSingleJob,
    postJob,
    updateJob,
    adminGetAllJobs,
    adminDeleteJob,
} from "../controllers/jobController.js";
import { isAuthenticated } from "../middlewares/auth.js"; // NO authorizeAdmin IMPORT

const router = express.Router();

router.get("/getall", getAllJobs);
router.post("/post", isAuthenticated, postJob);
router.get("/getmyjobs", isAuthenticated, getMyJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);
router.get("/:id", isAuthenticated, getSingleJob);

// --- Admin Job Routes --- (No Role-Based Auth Anymore)
router.get("/admin/jobs", isAuthenticated, adminGetAllJobs); // Admin - Get all jobs - AUTHENTICATED ONLY
router.delete("/admin/delete/:id", isAuthenticated, adminDeleteJob); // Admin - Delete job - AUTHENTICATED ONLY

export default router;