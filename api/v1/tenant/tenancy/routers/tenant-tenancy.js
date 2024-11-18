const express = require("express");
const router = express.Router();
const tenancy = require("../models/tenant-tenancy");

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

router.get("/tenant/check-tenancy", authenticateUser, async (req, res) => {
  try {
    if (isEmpty(req.user.user_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user_id = req.user.user_id;
    const result = await tenancy.checkTenancy(user_id);

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

router.get("/tenant/get-tenancy-info", authenticateUser, async (req, res) => {
  try {
    if (isEmpty(req.user.user_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user_id = req.user.user_id;
    const result = await tenancy.getTenancyInfo(user_id);

    return res.status(200).json({
      success: true,
      message: "Tenancy info retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error checking tenancy info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
