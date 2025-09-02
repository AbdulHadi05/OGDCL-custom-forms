import express from "express";
import {
  getForms,
  getForm,
  createForm,
  updateForm,
  deleteForm,
  publishForm,
  unpublishForm,
  getFormTemplates,
  createFormFromTemplate,
  getPublishedForms,
  getManagerForms,
  getFormsRequiringApproval,
  exportFormSubmissions,
} from "../controllers/formsController.js";

const router = express.Router();

// Form CRUD operations
router.get("/", getForms);
router.get("/published", getPublishedForms);
router.get("/templates", getFormTemplates);
router.get("/manager", getManagerForms);
router.get("/requiring-approval", getFormsRequiringApproval);
router.get("/:id", getForm);
router.get("/:id/export", exportFormSubmissions);
router.post("/", createForm);
router.post("/from-template/:templateId", createFormFromTemplate);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);

// Form publishing
router.patch("/:id/publish", publishForm);
router.patch("/:id/unpublish", unpublishForm);

export default router;
