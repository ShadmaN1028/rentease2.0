const table_name = "owners";

const queries = {
  getOwnerInfo: `SELECT owner_email, first_name, last_name, nid, permanent_address, contact_number, occupation, creation_date FROM ${table_name} WHERE owner_id = ?`,
};

module.exports = queries;
