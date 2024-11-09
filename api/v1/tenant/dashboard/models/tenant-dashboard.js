const connection = require("../../../connection/connection");
const queries = require("../queries/tenant-dashboard");

const tenant_dashboard = {
  getTenantInfo: async (user_id) => {
    try {
      const [tenantInfo] = await connection.query(queries.getTenantInfo, [
        user_id,
      ]);
      return tenantInfo;
    } catch (error) {
      console.error("Get tenant info error:", error);
      throw error;
    }
  },
};

module.exports = tenant_dashboard;
