const connection = require("../../../connection/connection");
const queries = require("../queries/owner-tenancies");

const owner_payments = {
  getTenancyList: async (owner_id) => {
    try {
      const [tenancyList] = await connection.query(queries.getTenancyList, [
        owner_id,
      ]);
      return tenancyList;
    } catch (error) {
      console.error("Get tenancies error:", error);
      throw error;
    }
  },
  getTenancyDetails: async (owner_id, tenancy_id) => {
    try {
      const [tenancyDetails] = await connection.query(
        queries.getTenancyDetails,
        [owner_id, tenancy_id]
      );
      return tenancyDetails;
    } catch (error) {
      console.error("Get tenancy details error:", error);
      throw error;
    }
  },
  removeTenancy: async (owner_id, tenancy_id) => {
    try {
      const [result] = await connection.query(queries.removeTenancy, [
        owner_id,
        tenancy_id,
      ]);
      return result;
    } catch (error) {
      console.error("remove tenancy error:", error);
      throw error;
    }
  },
};

module.exports = owner_payments;
