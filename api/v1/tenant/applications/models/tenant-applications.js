const connection = require("../../../connection/connection");
const queries = require("../queries/tenant-applications");

const tenant_applications = {
  makeApplications: async (flats_id, user_id) => {
    try {
      const [result] = await connection.query(queries.makeApplications, [
        flats_id, // flats_id for INSERT
        user_id, // user_id
        user_id, // created_by
        user_id, // last_updated_by
        flats_id, // flats_id for WHERE clause
      ]);
      return result;
    } catch (error) {
      console.error("Make application error:", error);
      throw error;
    }
  },
  checkApplications: async (user_id) => {
    try {
      const [result] = await connection.query(queries.checkApplications, [
        user_id,
      ]);
      return result;
    } catch (error) {
      console.error("Check application error:", error);
      throw error;
    }
  },
};

module.exports = tenant_applications;
