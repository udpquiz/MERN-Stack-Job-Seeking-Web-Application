import express from "express";
import { login, register, logout, getUser, adminGetAllUsers, adminDeleteUser, /* ADD THIS: */ updateUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

// --- Admin User Routes ---
router.get("/admin/users", isAuthenticated, adminGetAllUsers);
router.delete("/admin/delete/:id", isAuthenticated, adminDeleteUser);
router.put("/update/:id", isAuthenticated, updateUser); // ADD THIS LINE - User Update Route (Admin can use this)

export default router;