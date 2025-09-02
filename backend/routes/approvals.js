import express from "express";
import {
  getApprovals,
  getApproval,
  approveSubmission,
  rejectSubmission,
  getPendingApprovals,
  getManagerApprovals,
} from "../controllers/approvalsController.js";

const router = express.Router();

// Approval operations
router.get("/", getApprovals);
router.get("/pending", getPendingApprovals);
router.get("/manager/:managerId", getManagerApprovals);
router.get("/:id", getApproval);
router.post("/:submissionId/approve", approveSubmission);
router.post("/:submissionId/reject", rejectSubmission);

export default router;
