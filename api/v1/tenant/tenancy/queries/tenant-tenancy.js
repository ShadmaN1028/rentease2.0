const table_name = "tenancies";

const queries = {
  checkTenancy: `SELECT * FROM ${table_name} WHERE user_id = ? and status = 1`,
  getTenancyInfo: `SELECT b.building_name, b.address, o.first_name, o.last_name, o.contact_number, f.flat_number,f.flats_id, f.area, f.rooms, f.bath, f.balcony, f.description, t.start_date 
  FROM ${table_name} t JOIN flats f ON t.flats_id = f.flats_id JOIN building b  ON f.building_id = b.building_id JOIN owners o ON t.owner_id = o.owner_id  WHERE t.user_id = ? AND t.status = 1`,
  leaveTenancy: `UPDATE ${table_name} SET status = 0, last_update_date = CURRENT_TIMESTAMP(), change_number = change_number + 1  WHERE user_id = ?`,
  updateFlatStatus: `UPDATE flats SET status = 0, last_update_date = CURRENT_TIMESTAMP(), change_number = change_number + 1 WHERE flats_id = (SELECT flats_id FROM ${table_name} WHERE user_id = ? LIMIT 1)`,
  updateVacancies: `UPDATE building SET vacant_flats = vacant_flats + 1, last_update_date = CURRENT_TIMESTAMP(), change_number = change_number + 1 WHERE building_id = (SELECT building_id FROM flats WHERE flats_id = (SELECT flats_id FROM ${table_name} WHERE user_id = ? LIMIT 1))`,
};

module.exports = queries;
