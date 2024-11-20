const express = require("express");
const router = express.Router();
const notifications = require("../models/tenant-notifications");

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

router.get("/tenant/notifications-list", authenticateUser, async (req, res) => {
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
      const notificationsList = await notifications.getNotificationsList(
        decoded.user_id
      );
      return res.status(200).json({
        success: true,
        data: notificationsList,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching notifications list:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
router.get(
  "/tenant/notification-details/:notification_id",
  authenticateUser,
  async (req, res) => {
    const token = req.cookies.token;
    const { notification_id } = req.params;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    try {
      if (isEmpty(req.user.user_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = verifyToken(token);
      if (decoded) {
        const notificationDetails = await notifications.getNotificationDetails(
          decoded.user_id,
          notification_id
        );
        return res.status(200).json({
          success: true,
          data: notificationDetails,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error fetching notification details:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.put(
  "/tenant/mark-as-read/:notification_id",
  authenticateUser,
  async (req, res) => {
    const { notification_id } = req.params;
    if (!notification_id) {
      return res
        .status(400)
        .json({ success: false, message: "Notification ID is required" });
    }

    try {
      if (isEmpty(req.user.user_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = verifyToken(req.cookies.token);
      if (decoded) {
        const result = await notifications.markAsRead(
          decoded.user_id,
          notification_id
        );
        return res.status(200).json({
          success: true,
          message: "Notification marked as read",
          data: result,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;
