import express from "express";
import {
  getSubmissions,
  getSubmission,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getFormSubmissions,
} from "../controllers/submissionsController.js";

const router = express.Router();

// Submission operations
router.get("/", getSubmissions);
router.get("/form/:formId", getFormSubmissions);
router.get("/:id", getSubmission);
router.post("/", createSubmission);
router.put("/:id", updateSubmission);
router.delete("/:id", deleteSubmission);

export default router;
