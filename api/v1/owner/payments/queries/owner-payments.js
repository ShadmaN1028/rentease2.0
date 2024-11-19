const table_name = "payments";

const queries = {
  getPaymentsList: `
      SELECT ${table_name}.* FROM ${table_name} 
WHERE ${table_name}.owner_id = ? AND ${table_name}.tenancy_id IN (
  SELECT tenancies.tenancy_id 
  FROM tenancies 
  JOIN flats ON tenancies.flats_id = flats.flats_id 
  JOIN building ON flats.building_id = building.building_id 
  WHERE building.owner_id = ?
)

    `,
  getPaymentDetails: `
        SELECT ${table_name}.* FROM ${table_name} 
        WHERE ${table_name}.owner_id = ? AND ${table_name}.payment_id = ?
    `,
  getTenancyList: `SELECT tenancies.* FROM tenancies
            join flats on tenancies.flats_id = flats.flats_id 
            JOIN building ON flats.building_id = building.building_id 
            WHERE building.owner_id = ?`,

  recordPayment: `INSERT INTO ${table_name} (owner_id, tenancy_id, amount, payment_date, payment_type, status, created_by, creation_date, last_updated_by, last_update_date, change_number)  VALUES (?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ?,  CURRENT_TIMESTAMP(), ?, CURRENT_TIMESTAMP(), 1)`,
  updateTenancy: `UPDATE tenancies SET end_date = DATE_ADD(end_date, INTERVAL 1 MONTH), last_updated_by = ?, last_update_date = CURRENT_TIMESTAMP(), change_number = change_number + 1 WHERE tenancy_id = ?`,
  getPartiallyPaidPayments: `SELECT * FROM payments WHERE owner_id = ? and payment_type = 2`,
  updatePayments: `UPDATE payments SET amount = ?, payment_date = CURRENT_TIMESTAMP(), payment_type = ?,  status = ?, last_updated_by = ?, change_number = change_number + 1 WHERE payment_id = ? AND owner_id = ?`,
};

module.exports = queries;
