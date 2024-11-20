const table_name = "notifications";

const queries = {
  getNotificationsList: `select * from ${table_name} where user_id = ? AND created_by = user_id`,
  getNotificationDetails: `select * from ${table_name} where user_id = ? and notification_id = ?`,
  markAsRead: `UPDATE ${table_name} SET status = 1, last_update_date = CURRENT_TIMESTAMP(), change_number = change_number + 1 WHERE user_id = ? AND notification_id = ?`,
};

module.exports = queries;
