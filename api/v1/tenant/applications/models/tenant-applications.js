const connection = require("../../../connection/connection");
const queries = require("../queries/tenant-applications");

const tenant_applications = {
  makeApplications: async (flats_id, user_id) => {
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();

      // Check for active tenancy
      const [tenancies] = await conn.query(queries.checkTenancy, [user_id]);
      if (tenancies.length > 0) {
        throw new Error("Active tenancy exists");
      }

      const [existingApplications] = await conn.query(
        queries.checkExistingApplication,
        [user_id, flats_id]
      );
      if (existingApplications.length > 0) {
        throw new Error("Application for this flat already exists");
      }

      const [result] = await conn.query(queries.makeApplications, [
        flats_id,
        user_id,
        user_id,
        user_id,
        flats_id,
      ]);

      // Get owner_id, flat_number, and building_name for the flat
      const [flatDetails] = await conn.query(queries.getOwnerIdFromFlat, [
        flats_id,
      ]);
      if (flatDetails.length === 0) {
        throw new Error("Flat details not found");
      }
      const { owner_id, flat_number, building_name } = flatDetails[0];

      // Send notification to owner with updated description
      const notificationDescription = `New application received for Flat ${flat_number} in ${building_name}`;
      await conn.query(queries.sendNotification, [
        user_id,
        owner_id,
        notificationDescription,
        user_id,
        user_id,
      ]);

      await conn.commit();
      return result;
    } catch (error) {
      if (conn) await conn.rollback();
      console.error("Make application error:", error);
      throw error;
    } finally {
      if (conn) conn.release();
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
  checkTenancy: async (user_id) => {
    try {
      const [result] = await connection.query(queries.checkTenancy, [user_id]);
      return result;
    } catch (error) {
      console.error("Check tenancy error:", error);
      throw error;
    }
  },
};

module.exports = tenant_applications;
