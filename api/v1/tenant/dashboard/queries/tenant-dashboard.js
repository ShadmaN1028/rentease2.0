const table_name = "users";
const flats_table = "flats";

const queries = {
  getTenantInfo: `SELECT user_email, first_name, last_name, nid, permanent_address, contact_number, occupation, creation_date FROM ${table_name} WHERE user_id = ?`,
  getAvailableFlats: `SELECT * FROM ${flats_table} WHERE status = 0 ORDER BY creation_date DESC`,
};

module.exports = queries;
