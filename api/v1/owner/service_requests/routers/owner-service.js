const express = require("express");
const router = express.Router();
const request = require("../models/owner-service");

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

router.get("/owner/pending-request", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    if (isEmpty(req.user.owner_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyTokenOwner(token);
    if (decoded) {
      const pendingRequest = await request.getPendingRequests(decoded.owner_id);
      return res.status(200).json({
        success: true,
        data: pendingRequest,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching pending request:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post(
  "/owner/approve-request/:request_id",
  authenticateUser,
  async (req, res) => {
    const { request_id } = req.params;

    if (!request_id) {
      return res
        .status(400)
        .json({ success: false, message: "request ID is required" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const owner_id = req.user.owner_id;
      const result = await request.approveRequest(request_id, owner_id);

      return res.status(200).json({
        success: true,
        message: "Request approved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error approving request:", error);
      if (error.message === "Request not found or already approved") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.post(
  "/owner/deny-request/:request_id",
  authenticateUser,
  async (req, res) => {
    const { request_id } = req.params;

    if (!request_id) {
      return res
        .status(400)
        .json({ success: false, message: "Request ID is required" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const owner_id = req.user.owner_id;
      const result = await request.denyRequest(request_id, owner_id);

      return res.status(200).json({
        success: true,
        message: "Request denied successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error denying request:", error);
      if (error.message === "Request not found or already denied") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;
