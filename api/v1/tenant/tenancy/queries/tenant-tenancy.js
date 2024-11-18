const table_name = "tenancies";

const queries = {
  checkTenancy: `SELECT * FROM ${table_name} WHERE user_id = ?`,
  getTenancyInfo: `SELECT b.building_name, b.address, o.first_name, o.last_name, o.contact_number, f.flat_number, f.area, f.rooms, f.bath, f.balcony, f.description, t.start_date 
  FROM ${table_name} t JOIN flats f ON t.flats_id = f.flats_id JOIN building b  ON f.building_id = b.building_id JOIN owners o ON t.owner_id = o.owner_id  WHERE t.user_id = ?`,
};

module.exports = queries;
