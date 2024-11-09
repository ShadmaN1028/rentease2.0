const connection = require("../../../connection/connection");
const queries = require("../queries/owner-dashboard");

const owner_dashboard = {
  getOwnerInfo: async (owner_id) => {
    try {
      const [ownerInfo] = await connection.query(queries.getOwnerInfo, [
        owner_id,
      ]);
      return ownerInfo;
    } catch (error) {
      console.error("Get owner info error:", error);
      throw error;
    }
  },
};

module.exports = owner_dashboard;
