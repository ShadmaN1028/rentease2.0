const express = require("express");
const router = express.Router();
const requests = require("../models/tenant_service");

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
  "/tenant/make-requests/:flats_id",
  authenticateUser,
  async (req, res) => {
    const { flats_id } = req.params;
    const { request_type, description } = req.body;
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
      const result = await requests.makeRequests(
        flats_id,
        user_id,
        request_type,
        description
      );

      return res.status(200).json({
        success: true,
        message: "Request submitted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error making request:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.get("/tenant/check-requests", authenticateUser, async (req, res) => {
  try {
    if (isEmpty(req.user.user_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user_id = req.user.user_id;
    const result = await requests.checkRequests(user_id);

    return res.status(200).json({
      success: true,
      message: "Requests retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error checking requests:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
