const express = require("express");
const router = express.Router();
const notifications = require("../models/owner-notifications");

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

router.get("/owner/notifications-list", authenticateUser, async (req, res) => {
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
      const notificationsList = await notifications.getNotificationsList(
        decoded.owner_id
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
  "/owner/notification-details/:notification_id",
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
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = verifyTokenOwner(token);
      if (decoded) {
        const notificationDetails = await notifications.getNotificationDetails(
          decoded.owner_id,
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

router.get(
  "/owner/notifications/tenancy-list",
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
        const notificationTenancyList = await notifications.getTenancyList(
          decoded.owner_id
        );
        return res.status(200).json({
          success: true,
          data: notificationTenancyList,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error fetching tenancy list :", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.post(
  "/owner/send-notification/:user_id",
  authenticateUser,
  async (req, res) => {
    const { user_id } = req.params;
    const { description } = req.body;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "user ID is required" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const owner_id = req.user.owner_id;
      const result = await notifications.sendNotifications(
        user_id,
        owner_id,
        description,
        owner_id,
        owner_id
      );

      return res.status(200).json({
        success: true,
        message: "notf sent successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error sending notf:", error);
      if (error.message === "notf not found ") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.put(
  "/owner/mark-as-read/:notification_id",
  authenticateUser,
  async (req, res) => {
    const { notification_id } = req.params;
    if (!notification_id) {
      return res
        .status(400)
        .json({ success: false, message: "Notification ID is required" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = verifyTokenOwner(req.cookies.token);
      if (decoded) {
        const result = await notifications.markAsRead(
          decoded.owner_id,
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

router.get(
  "/owner/unread-notifications",
  authenticateUser,
  async (req, res) => {
    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = verifyTokenOwner(req.cookies.token);
      if (decoded) {
        const unreadNotifications = await notifications.unreadNotifications(
          decoded.owner_id
        );
        return res.status(200).json({
          success: true,
          data: unreadNotifications,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;
