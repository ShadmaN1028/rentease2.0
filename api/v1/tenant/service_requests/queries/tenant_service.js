const table_name = "service_requests";

const queries = {
  checkRequests: `SELECT * FROM ${table_name} WHERE user_id = ?`,
  makeRequests: `INSERT INTO ${table_name} (user_id, flats_id, request_type, description, status, created_by, creation_date, last_updated_by, last_update_date, change_number) 
  VALUES (?,?,?,?,0,?,CURRENT_TIMESTAMP(),?,CURRENT_TIMESTAMP(),1)`,
};

module.exports = queries;
