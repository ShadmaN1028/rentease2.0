const table_name = "notifications";

const queries = {
  getTenancyList: `SELECT t.*, u.first_name, u.last_name, f.flat_number FROM tenancies t join users u on t.user_id = u.user_id join flats f on t.flats_id = f.flats_id WHERE t.owner_id = ?`,
  sendNotifications: `
      INSERT INTO ${table_name} (user_id, owner_id, description, status, created_by, creation_date, last_updated_by, last_update_date, change_number) 
       VALUES (?, ?, ?, 0, ?, CURRENT_TIMESTAMP(), ?,  CURRENT_TIMESTAMP(), 1)
    `,
  getNotificationsList: `SELECT ${table_name}.*, u.first_name, u.last_name, f.flat_number FROM ${table_name} join users u on ${table_name}.user_id = u.user_id join tenancies t on ${table_name}.user_id = t.user_id join flats f on t.flats_id = f.flats_id WHERE ${table_name}.owner_id = ?`,
  getNotificationDetails: `SELECT ${table_name}.*, u.first_name, u.last_name, f.flat_number FROM ${table_name} join users u on ${table_name}.user_id = u.user_id join tenancies t on ${table_name}.user_id = t.user_id join flats f on t.flats_id = f.flats_id WHERE owner_id = ? AND notification_id = ?`,
};

module.exports = queries;
