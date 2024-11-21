const express = require("express");
const router = express.Router();
const tenancy = require("../models/owner-tenancies");

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
  "/owner/tenancy/tenancy-list",
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
        const paymentTenancyList = await tenancy.getTenancyList(
          decoded.owner_id
        );
        return res.status(200).json({
          success: true,
          data: paymentTenancyList,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.get(
  "/owner/tenancy/tenancy-details/:tenancy_id",
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
        const tenancyDetails = await tenancy.getTenancyDetails(
          decoded.owner_id,
          req.params.tenancy_id
        );
        return res.status(200).json({
          success: true,
          data: tenancyDetails,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error fetching tenancy details:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.put(
  "/owner/tenancy/remove-tenancy/:tenancy_id",
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
        const result = await tenancy.removeTenancy(
          decoded.owner_id,
          req.params.tenancy_id
        );
        return res.status(200).json({
          success: true,
          message: "Tenancy removed successfully",
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error removing tenancy:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;
