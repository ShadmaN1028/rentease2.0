const table_name = "tenancies";

const queries = {
  getTenancyList: `SELECT t.*, u.first_name, u.last_name, f.flat_number FROM ${table_name} t join users u on t.user_id = u.user_id join flats f on t.flats_id = f.flats_id WHERE t.owner_id = ?`,
  getTenancyDetails: `SELECT t.*, u.first_name, u.last_name, f.flat_number FROM ${table_name} t join users u on t.user_id = u.user_id join flats f on t.flats_id = f.flats_id WHERE t.owner_id = ? AND t.tenancy_id = ?`,
  removeTenancy: `UPDATE ${table_name} SET status = 0 WHERE owner_id = ? AND tenancy_id = ?`,
};

module.exports = queries;
