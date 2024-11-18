const connection = require("../../../connection/connection");
const queries = require("../queries/tenant_service");

const tenant_service = {
  checkRequests: async (user_id) => {
    try {
      const [result] = await connection.query(queries.checkRequests, [user_id]);
      return result;
    } catch (error) {
      console.error("Check tenancy error:", error);
      throw error;
    }
  },
  makeRequests: async (user_id, flats_id, request_type, description) => {
    try {
      const [result] = await connection.query(queries.makeRequests, [
        user_id,
        flats_id,
        request_type,
        description,
        user_id,
        user_id,
      ]);
      return result;
    } catch (error) {
      console.error("Make requests error:", error);
      throw error;
    }
  },
};

module.exports = tenant_service;
