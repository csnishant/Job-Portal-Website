import express from "express";
import multer from "multer";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  checkATSScore, // 👈 NEW
} from "../controllers/application.controller.js";

const router = express.Router();

// multer setup (resume upload)
const upload = multer({ dest: "uploads/" });

// 🔥 1. ATS CHECK (MANDATORY BEFORE APPLY)
router
  .route("/check-ats/:id")
  .post(isAuthenticated, upload.single("resume"), checkATSScore);

// 🔥 2. APPLY JOB (NOW PROTECTED BY ATS)
router.route("/apply/:id").post(isAuthenticated, applyJob);

// Existing routes (same)
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;
