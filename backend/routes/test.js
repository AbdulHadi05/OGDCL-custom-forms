import express from "express";
import { validateAzureToken } from "../middleware/auth.js";

const router = express.Router();

// Test endpoint to see what user data we get
router.get("/test-user", validateAzureToken, (req, res) => {
  res.json({
    message: "User data from middleware",
    user: req.user,
    rawUserFromMiddleware: req.user,
  });
});

export default router;
