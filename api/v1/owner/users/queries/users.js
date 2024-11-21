const table_name = "owners";

const queries = {
  createAccount: `INSERT INTO ${table_name} (owner_email, owner_password, first_name, last_name, nid, permanent_address, contact_number, occupation, created_by, creation_date, last_updated_by, last_update_date, change_number) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, "owner", CURRENT_TIMESTAMP, "owner", CURRENT_TIMESTAMP, 1)`,
  getUserById: `SELECT owner_id, owner_email, first_name, last_name, nid, permanent_address, contact_number, occupation FROM ${table_name} WHERE owner_id = ?`,
  loginByEmail: `SELECT owner_id,  owner_email, owner_password FROM ${table_name} WHERE owner_email = ?`,
  existingCheck: `SELECT owner_id FROM ${table_name} WHERE owner_email = ?`,
  updateInfo: `UPDATE ${table_name} SET first_name = ?, last_name = ?, nid = ?, permanent_address = ?, contact_number = ?, occupation = ?, last_update_date = CURRENT_TIMESTAMP(), change_number = change_number + 1 WHERE owner_id = ?`,
  getUserPassword: `SELECT owner_password FROM ${table_name} WHERE owner_id = ?`,
  updatePassword: `UPDATE ${table_name} SET owner_password = ?, last_update_date = CURRENT_TIMESTAMP(), change_number = change_number + 1 WHERE owner_id = ?`,
};

module.exports = queries;
