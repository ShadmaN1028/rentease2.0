const table_name = "applications";
const flats_table = "flats";
const building_table = "building";
const tenancies_table = "tenancies";
const notifications_table = "notifications";

const queries = {
  checkExistingApplication: `SELECT * FROM ${table_name} WHERE user_id = ? AND flats_id = ?`,
  makeApplications: `
    INSERT INTO ${table_name} (flats_id, building_id, user_id, owner_id, status, created_by, creation_date, last_updated_by, last_update_date, change_number)
    SELECT ?, f.building_id, ?, b.owner_id, 0, ?, CURRENT_TIMESTAMP(), ?, CURRENT_TIMESTAMP(), 1
    FROM ${flats_table} f
    JOIN ${building_table} b ON f.building_id = b.building_id
    WHERE f.flats_id = ?
  `,
  checkApplications: `SELECT * FROM ${table_name} WHERE user_id = ?`,
  checkTenancy: `SELECT * FROM ${tenancies_table} WHERE user_id = ? AND status = 1`,
  sendNotification: `
    INSERT INTO ${notifications_table} (user_id, owner_id, description, status, created_by, creation_date, last_updated_by, last_update_date, change_number)
    VALUES (?, ?, ?, 0, ?, CURRENT_TIMESTAMP(), ?, CURRENT_TIMESTAMP(), 1)
  `,
  getOwnerIdFromFlat: `
    SELECT b.owner_id, b.building_name, f.flat_number
    FROM ${flats_table} f
    JOIN ${building_table} b ON f.building_id = b.building_id
    WHERE f.flats_id = ?
  `,
};

module.exports = queries;
