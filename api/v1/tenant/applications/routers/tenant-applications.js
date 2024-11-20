const express = require("express");
const router = express.Router();
const applications = require("../models/tenant-applications");

const { verifyToken } = require("../../../jwt");
const isEmpty = require("is-empty");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }
  try {
    const decoded = verifyToken(token);
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

router.post(
  "/tenant/make-applications/:flats_id",
  authenticateUser,
  async (req, res) => {
    const { flats_id } = req.params;

    if (!flats_id) {
      return res
        .status(400)
        .json({ success: false, message: "Flat ID is required" });
    }

    try {
      if (isEmpty(req.user.user_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const user_id = req.user.user_id;

      const result = await applications.makeApplications(flats_id, user_id);

      return res.status(200).json({
        success: true,
        message: "Application submitted successfully and owner notified",
        data: result,
      });
    } catch (error) {
      console.error("Error making application:", error);
      if (error.message === "Active tenancy exists") {
        return res.status(400).json({
          success: false,
          message:
            "You must leave your current tenancy to make a new application",
        });
      }
      if (error.message === "Application for this flat already exists") {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this flat",
        });
      }
      if (error.message === "Owner not found for this flat") {
        return res.status(404).json({
          success: false,
          message: "Owner not found for this flat",
        });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.get("/tenant/check-applications", authenticateUser, async (req, res) => {
  try {
    if (isEmpty(req.user.user_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user_id = req.user.user_id;
    const result = await applications.checkApplications(user_id);

    return res.status(200).json({
      success: true,
      message: "Applications retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error checking applications:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/tenant/check-tenancy", authenticateUser, async (req, res) => {
  try {
    if (isEmpty(req.user.user_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user_id = req.user.user_id;
    const result = await applications.checkTenancy(user_id);

    return res.status(200).json({
      success: true,
      message: "Tenancy retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error checking tenancy:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
