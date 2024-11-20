const express = require("express");
const router = express.Router();
const applications = require("../models/owner-applications");

const { verifyTokenOwner } = require("../../../jwt");
const isEmpty = require("is-empty");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }
  try {
    const decoded = verifyTokenOwner(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

router.get(
  "/owner/pending-applications",
  authenticateUser,
  async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = verifyTokenOwner(token);
      if (decoded) {
        const pendingApplications = await applications.getPendingApplications(
          decoded.owner_id
        );
        return res.status(200).json({
          success: true,
          data: pendingApplications,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error fetching pending applications:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.post(
  "/owner/approve-application/:applications_id",
  authenticateUser,
  async (req, res) => {
    const { applications_id } = req.params;

    if (!applications_id) {
      return res
        .status(400)
        .json({ success: false, message: "Application ID is required" });
    }

    try {
      if (!req.user.owner_id) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const owner_id = req.user.owner_id;
      const result = await applications.approveApplication(
        applications_id,
        owner_id
      );

      // Directly forward the result as the response if it's already structured properly
      if (!result.success) {
        return res.status(result.statusCode).json(result);
      }

      // Send success response
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error approving application:", error);
      if (error.message === "Application not found or already approved") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.post(
  "/owner/deny-application/:applications_id",
  authenticateUser,
  async (req, res) => {
    const { applications_id } = req.params;

    if (!applications_id) {
      return res
        .status(400)
        .json({ success: false, message: "Application ID is required" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const owner_id = req.user.owner_id;
      const result = await applications.denyApplication(
        applications_id,
        owner_id
      );

      return res.status(200).json({
        success: true,
        message: "Application denied successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error denying application:", error);
      if (error.message === "Application not found or already denied") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;
