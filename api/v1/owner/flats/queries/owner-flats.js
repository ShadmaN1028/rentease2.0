const table_name = "flats";
const codes_table = "flat_codes";

const queries = {
  addFlats: `INSERT INTO ${table_name} (building_id, flat_number, area, rooms, bath, balcony, description, status, rent, tenancy_type, created_by, creation_date, last_updated_by, last_update_date, change_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?,?,  CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, 1)`,
  getFlats: `SELECT f.*, b.building_id, b.building_name FROM ${table_name} f JOIN building b ON f.building_id = b.building_id WHERE f.building_id = ?`,
  getFlatInfo: `SELECT f.*, b.building_id, b.building_name  FROM ${table_name} f  JOIN building b ON f.building_id = b.building_id WHERE v.flats_id = ?`,
  updateFlat: `UPDATE ${table_name} SET area = ?, rooms = ?, bath = ?, balcony = ?, description = ?, status = ?, rent = ?, tenancy_type = ?,  last_updated_by = ?, last_update_date = CURRENT_TIMESTAMP, change_number = change_number + 1 WHERE flats_id = ?`,
  deleteFlats: `DELETE FROM ${table_name} WHERE flats_id = ? `,
  searchFlats: `SELECT * FROM ${table_name} WHERE flat_number LIKE ? OR area LIKE ? OR status LIKE ? OR tenancy_type LIKE ?`,
  generateFlatCode: `INSERT INTO ${codes_table} (flats_id, code, created_by, creation_date, last_updated_by, last_update_date, change_number) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, 1)`,
  checkExistingFlatCode: `SELECT * FROM ${codes_table} WHERE flats_id = ?`,
  getFlatCode: `SELECT code FROM ${codes_table} WHERE flats_id = ?`,
  deleteFlatCode: `DELETE FROM ${codes_table} WHERE flats_id = ?`,
};

module.exports = queries;
