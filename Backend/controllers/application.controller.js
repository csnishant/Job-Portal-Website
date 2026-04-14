import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";


import { analyzeResume } from "../utils/ai.js";
import { calculateATSScore } from "../utils/atsCalculator.js";
import { extractTextFromPDF } from "../utils/parser.js";
export const checkATSScore = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    const resumePath = req.file.path;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const resumeText = await extractTextFromPDF(resumePath);

    // 🔥 VALIDATION (IMPORTANT)
    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Resume text not extracted properly",
      });
    }

    const result = await analyzeResume(resumeText, job.description);

    let application = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (!application) {
      application = await Application.create({
        job: jobId,
        applicant: userId,
      });
    }

    application.atsScore = result.score;
    application.matchedKeywords = result.matchedKeywords;
    application.missingKeywords = result.missingKeywords;
    application.isATSChecked = true;

    await application.save();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};


export const improveResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    const prompt = `
Improve this resume based on job description.

Return improved resume content.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
    });

    return res.json({
      improvedResume: response.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);
  }
};

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    const application = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    // ❌ ATS CHECK NAHI KIYA
    if (!application || !application.isATSChecked) {
      return res.status(400).json({
        message: "Please check ATS score before applying.",
        success: false,
      });
    }

    // ❌ LOW SCORE
    if (application.atsScore < 50) {
      return res.status(400).json({
        message: "ATS score too low. Improve resume first.",
        success: false,
      });
    }

    // ❌ Already applied (final submit)
    if (application.status === "applied") {
      return res.status(400).json({
        message: "You have already applied.",
        success: false,
      });
    }

    // ✅ FINAL APPLY
    application.status = "applied";
    await application.save();

    const job = await Job.findById(jobId);
    job.applications.push(application._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No Applications",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      succees: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
