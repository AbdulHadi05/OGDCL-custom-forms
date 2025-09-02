import express from "express";
import {
  validateAzureEmail,
  getCurrentUser,
} from "../controllers/usersController.js";
import { validateAzureToken } from "../middleware/auth.js";

const router = express.Router();

// All routes already have authentication from server.js

// Validate Microsoft email
router.post("/validate-email", validateAzureEmail);

// Get current user info
router.get("/me", getCurrentUser);

export default router;
