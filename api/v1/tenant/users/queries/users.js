const table_name = "users";

const queries = {
  createAccount: `INSERT INTO ${table_name} (user_email, user_password, first_name, last_name, nid, permanent_address, contact_number, occupation, created_by, creation_date, last_updated_by, last_update_date, change_number) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, "user", CURRENT_TIMESTAMP, "user", CURRENT_TIMESTAMP, 1)`,
  getUserById: `SELECT user_id, user_email FROM ${table_name} WHERE user_id = ?`,
  loginByEmail: `SELECT user_id,  user_email, user_password FROM ${table_name} WHERE user_email = ?`,
  existingCheck: `SELECT user_id FROM ${table_name} WHERE user_email = ?`,
};

module.exports = queries;
