const table_name = "building";

const queries = {
  addBuilding: `INSERT INTO ${table_name} (owner_id, building_name, address, vacant_flats, parking, created_by, creation_date, last_updated_by, last_update_date, change_number) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, 1)`,
  getBuildings: `SELECT owner_id, building_id, building_name, address, vacant_flats, parking FROM ${table_name} WHERE owner_id = ?`,
  getBuildingInfo: `SELECT owner_id, building_name, address, vacant_flats, parking FROM ${table_name} WHERE owner_id = ? AND building_id = ?`,
  deleteBuildings: `DELETE FROM ${table_name} WHERE owner_id = ? AND building_id = ?`,
  updateBuilding: `UPDATE ${table_name} SET building_name = ?, address = ?, vacant_flats = ?, parking = ?, last_updated_by = ?, last_update_date = CURRENT_TIMESTAMP, change_number = change_number + 1 WHERE owner_id = ? AND building_id = ?`,
  searchBuildings: `SELECT owner_id, building_name, address, vacant_flats, parking FROM ${table_name} WHERE (building_name LIKE ? OR address LIKE ?) AND owner_id = ?`,
};

module.exports = queries;
