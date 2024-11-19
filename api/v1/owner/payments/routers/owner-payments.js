const express = require("express");
const router = express.Router();
const payments = require("../models/owner-payments");

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

router.get("/owner/payments-list", authenticateUser, async (req, res) => {
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
      const paymentsList = await payments.getPaymentsList(
        decoded.owner_id,
        decoded.owner_id
      );
      return res.status(200).json({
        success: true,
        data: paymentsList,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching payments list:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
router.get(
  "/owner/payments-details/:payment_id",
  authenticateUser,
  async (req, res) => {
    const token = req.cookies.token;
    const { payment_id } = req.params;
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
        const paymentDetails = await payments.getPaymentDetails(
          decoded.owner_id,
          payment_id
        );
        return res.status(200).json({
          success: true,
          data: paymentDetails,
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
  "/owner/payments/tenancy-list",
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
        const paymentTenancyList = await payments.getTenancyList(
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

router.post(
  "/owner/payments/:tenancy_id",
  authenticateUser,
  async (req, res) => {
    const { tenancy_id } = req.params;
    const { amount, payment_type, status } = req.body;
    if (!tenancy_id) {
      return res
        .status(400)
        .json({ success: false, message: "tenancy ID is required" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const owner_id = req.user.owner_id;
      const result = await payments.recordPayment(
        owner_id,
        tenancy_id,
        amount,
        payment_type,
        status,
        owner_id
      );

      return res.status(200).json({
        success: true,
        message: "payment recorded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error recording payment:", error);
      if (error.message === "payment not found or already recorded") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.get(
  "/owner/payments/partially-paid",
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
        const partiallyPaid = await payments.getPartiallyPaidPayments(
          decoded.owner_id
        );
        return res.status(200).json({
          success: true,
          data: partiallyPaid,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error fetching partially paid payments:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.put(
  "/owner/update-payment/:payment_id",
  authenticateUser,
  async (req, res) => {
    const { payment_id } = req.params;
    const { amount, payment_type, status } = req.body;
    if (!payment_id) {
      return res
        .status(400)
        .json({ success: false, message: "payment ID is required" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const owner_id = req.user.owner_id;
      const result = await payments.updatePayments(
        amount,
        payment_type,
        status,
        owner_id,
        payment_id
      );

      return res.status(200).json({
        success: true,
        message: "payment udpated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      if (error.message === "payment not found or already udpated") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;
