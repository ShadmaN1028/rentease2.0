const connection = require("../../../connection/connection");
const queries = require("../queries/owner-applications");

const owner_applications = {
  getPendingApplications: async (owner_id) => {
    try {
      const [applications] = await connection.query(
        queries.getPendingApplications,
        [owner_id]
      );
      return applications;
    } catch (error) {
      console.error("Get applications error:", error);
      throw error;
    }
  },
  approveApplication: async (applications_id, owner_id) => {
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();

      // 1. Approve the application
      const [approveResult] = await conn.query(queries.approveApplication, [
        applications_id,
        owner_id,
      ]);

      if (approveResult.affectedRows === 0) {
        throw new Error("Application not found or already approved");
      }

      // 2. Get application details
      const [applicationDetails] = await conn.query(
        "SELECT flats_id, user_id, building_id FROM applications WHERE applications_id = ?",
        [applications_id]
      );

      if (applicationDetails.length === 0) {
        throw new Error("Application details not found");
      }

      const { flats_id, user_id, building_id } = applicationDetails[0];

      // 3. Update flat status
      await conn.query(queries.updateFlatStatus, [flats_id]);

      // 4. Update building vacancies
      await conn.query(queries.updateVacancies, [building_id, owner_id]);

      // 5. Start tenancy
      await conn.query(queries.startTenancy, [
        flats_id,
        user_id,
        owner_id,
        owner_id, // created_by
        owner_id, // updated_by
      ]);

      await conn.commit();
      return {
        success: true,
        message: "Application approved and tenancy started",
      };
    } catch (error) {
      if (conn) await conn.rollback();
      console.error("Approve application error:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },
  denyApplication: async (applications_id, owner_id) => {
    try {
      const [denyResult] = await connection.query(queries.denyApplication, [
        applications_id,
        owner_id,
      ]);

      if (denyResult.affectedRows === 0) {
        throw new Error("Application not found or already denied");
      }

      return {
        success: true,
        message: "Application denied successfully",
      };
    } catch (error) {
      console.error("Deny application error:", error);
      throw error;
    }
  },
};

module.exports = owner_applications;
