const connection = require("../../../connection/connection");
const queries = require("../queries/tenant-tenancy");

const tenant_tenancies = {
  checkTenancy: async (user_id) => {
    try {
      const [result] = await connection.query(queries.checkTenancy, [user_id]);
      return result;
    } catch (error) {
      console.error("Check tenancy error:", error);
      throw error;
    }
  },
  getTenancyInfo: async (user_id) => {
    try {
      const [result] = await connection.query(queries.getTenancyInfo, [
        user_id,
      ]);
      return result;
    } catch (error) {
      console.error("Check tenancy error:", error);
      throw error;
    }
  },
};

module.exports = tenant_tenancies;
