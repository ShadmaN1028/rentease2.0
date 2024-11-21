const express = require("express");
const router = express.Router();
const tenants = require("../models/tenant-dashboard");

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

router.get("/tenant/dashboard", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    if (isEmpty(req.user.user_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    if (decoded) {
      const tenantInfo = await tenants.getTenantInfo(decoded.user_id);
      return res.status(200).json({
        success: true,
        data: tenantInfo,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching tenant info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/tenant/available-flats", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    if (isEmpty(req.user.user_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    if (decoded) {
      const availableFlats = await tenants.getAvailableFlats();
      return res.status(200).json({
        success: true,
        data: availableFlats,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching tenant info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
router.post("/tenant/search-flats", authenticateUser, async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res
      .status(400)
      .json({ success: false, message: "Search query is required" });
  }

  try {
    const flats = await tenants.searchFlats(search);
    return res.status(200).json({
      success: true,
      data: flats,
    });
  } catch (error) {
    console.error("Error searching flats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
