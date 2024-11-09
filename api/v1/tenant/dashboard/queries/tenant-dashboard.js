const table_name = "users";

const queries = {
  getTenantInfo: `SELECT user_email, first_name, last_name, nid, permanent_address, contact_number, occupation, creation_date FROM ${table_name} WHERE user_id = ?`,
};

module.exports = queries;
