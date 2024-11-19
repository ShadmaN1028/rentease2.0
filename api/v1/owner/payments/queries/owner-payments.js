const table_name = "payments";

const queries = {
  getPaymentsList: `
      SELECT ${table_name}.*, u.first_name, u.last_name, f.flat_number FROM ${table_name} join tenancies t on ${table_name}.tenancy_id = t.tenancy_id join users u on t.user_id = u.user_id join flats f on t.flats_id = f.flats_id  WHERE ${table_name}.owner_id = ? 

    `,
  getPaymentDetails: `
        SELECT ${table_name}.*, u.first_name, u.last_name, f.flat_number FROM ${table_name} join tenancies t on ${table_name}.tenancy_id = t.tenancy_id join users u on t.user_id = u.user_id join flats f on t.flats_id = f.flats_id
        WHERE ${table_name}.owner_id = ? AND ${table_name}.payment_id = ?
    `,
  getTenancyList: `SELECT t.*, u.first_name, u.last_name, f.flat_number FROM tenancies t join users u on t.user_id = u.user_id join flats f on t.flats_id = f.flats_id WHERE t.owner_id = ?`,

  recordPayment: `INSERT INTO ${table_name} (owner_id, tenancy_id, amount, payment_date, payment_type, status, created_by, creation_date, last_updated_by, last_update_date, change_number)  VALUES (?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ?,  CURRENT_TIMESTAMP(), ?, CURRENT_TIMESTAMP(), 1)`,
  updateTenancy: `UPDATE tenancies SET end_date = DATE_ADD(end_date, INTERVAL 1 MONTH), last_updated_by = ?, last_update_date = CURRENT_TIMESTAMP(), change_number = change_number + 1 WHERE tenancy_id = ?`,
  getPartiallyPaidPayments: `SELECT ${table_name}.*, u.first_name, u.last_name, f.flat_number FROM ${table_name} join tenancies t on ${table_name}.tenancy_id = t.tenancy_id join users u on t.user_id = u.user_id join flats f on t.flats_id = f.flats_id
        WHERE ${table_name}.owner_id = ? AND ${table_name}.payment_id = 2`,
  updatePayments: `UPDATE payments SET amount = ?, payment_date = CURRENT_TIMESTAMP(), payment_type = ?,  status = ?, last_updated_by = ?, change_number = change_number + 1 WHERE payment_id = ? AND owner_id = ?`,
  getUnpaidPayments: `SELECT t.*, u.first_name, u.last_name, f.flat_number
FROM tenancies t
JOIN users u ON t.user_id = u.user_id
JOIN flats f ON t.flats_id = f.flats_id
LEFT JOIN ${table_name} ON ${table_name}.tenancy_id = t.tenancy_id
WHERE ${table_name}.tenancy_id IS NULL
  AND t.owner_id = ?;
`,
};

module.exports = queries;
