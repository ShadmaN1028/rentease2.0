const connection = require("../../../connection/connection");
const queries = require("../queries/tenant-notifications");

const tenant_notificaions = {
  getNotificationsList: async (user_id) => {
    try {
      const [notificationsList] = await connection.query(
        queries.getNotificationsList,
        [user_id]
      );
      return notificationsList;
    } catch (error) {
      console.error("Get notifications error:", error);
      throw error;
    }
  },
  getNotificationDetails: async (user_id, notification_id) => {
    try {
      const [notificationsDetails] = await connection.query(
        queries.getNotificationDetails,
        [user_id, notification_id]
      );
      return notificationsDetails;
    } catch (error) {
      console.error("Get notification details error:", error);
      throw error;
    }
  },

  markAsRead: async (user_id, notification_id) => {
    try {
      const [result] = await connection.query(queries.markAsRead, [
        user_id,
        notification_id,
      ]);
      if (result.affectedRows === 0) {
        throw new Error("mark as read failed");
      }
      return {
        success: true,
        message: "notif marked as read",
      };
    } catch (error) {
      console.error("mark as read error:", error);
      throw error;
    }
  },
  unreadNotifications: async (user_id) => {
    try {
      const [unreadNotifications] = await connection.query(
        queries.unreadNotifications,
        [user_id]
      );
      return unreadNotifications;
    } catch (error) {
      console.error("Get unread notifications error:", error);
      throw error;
    }
  },
};

module.exports = tenant_notificaions;
