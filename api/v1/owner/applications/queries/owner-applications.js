const table_name = "applications";

const queries = {
  getPendingApplications: `
    SELECT * FROM ${table_name} WHERE status = 0 AND owner_id = ?
  `,
  approveApplication: `UPDATE ${table_name} SET status = 1 WHERE applications_id = ? AND owner_id = ?`,
  denyApplication: `UPDATE ${table_name} SET status = 2 WHERE applications_id = ? AND owner_id = ?`,
  updateFlatStatus: `UPDATE flats SET status = 1 WHERE flats_id = ?`,
  updateVacancies: `UPDATE building SET vacant_flats = vacant_flats - 1 WHERE building_id = ? AND owner_id = ?`,
  startTenancy: `INSERT INTO tenancies (flats_id, user_id, owner_id, start_date, end_date, status, created_by, creation_date, last_updated_by, last_update_date, change_number) 
  VALUES (?, ?, ?, CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 2 MONTH), 1, ?, CURRENT_TIMESTAMP(), ?, CURRENT_TIMESTAMP(), 1)`,
};

module.exports = queries;
