const table_name = "service_requests";

const queries = {
  getPendingRequests: `
        SELECT ${table_name}.* FROM ${table_name} 
        WHERE ${table_name}.status = 0 AND ${table_name}.flats_id IN (
            SELECT flats.flats_id FROM flats 
            JOIN building ON flats.building_id = building.building_id 
            WHERE building.owner_id = ?
        )
    `,
  approveRequest: `
        UPDATE ${table_name} 
        SET ${table_name}.status = 1 
        WHERE ${table_name}.request_id = ? AND ${table_name}.flats_id IN (
            SELECT flats.flats_id FROM flats 
            JOIN building ON flats.building_id = building.building_id 
            WHERE building.owner_id = ?
        )
    `,
  denyRequest: `
        UPDATE ${table_name} 
        SET ${table_name}.status = 2 
        WHERE ${table_name}.request_id = 1 AND ${table_name}.flats_id IN (
            SELECT flats.flats_id FROM flats 
            JOIN building ON flats.building_id = building.building_id 
            WHERE building.owner_id = 1
        )
    `,
};

module.exports = queries;
