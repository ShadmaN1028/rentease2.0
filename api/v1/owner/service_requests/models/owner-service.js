const connection = require("../../../connection/connection");
const queries = require("../queries/owner-service");

const owner_service = {
  getPendingRequests: async (owner_id) => {
    try {
      const [requests] = await connection.query(queries.getPendingRequests, [
        owner_id,
      ]);
      return requests;
    } catch (error) {
      console.error("Get applications error:", error);
      throw error;
    }
  },
  approveRequest: async (request_id, owner_id) => {
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();

      // 1. Approve the application
      const [approveResult] = await conn.query(queries.approveRequest, [
        request_id,
        owner_id,
      ]);

      if (approveResult.affectedRows === 0) {
        throw new Error("service not found or already approved");
      }

      // 2. Get application details
      const [applicationDetails] = await conn.query(
        "SELECT * FROM service_requests WHERE request_id = ?",
        [request_id]
      );

      if (applicationDetails.length === 0) {
        throw new Error("request details not found");
      }

      await conn.commit();
      return {
        success: true,
        message: "request approved",
      };
    } catch (error) {
      if (conn) await conn.rollback();
      console.error("Approve application error:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },
  denyApplication: async (request_id, owner_id) => {
    try {
      const [denyResult] = await connection.query(queries.denyRequest, [
        request_id,
        owner_id,
      ]);

      if (denyResult.affectedRows === 0) {
        throw new Error("Request not found or already denied");
      }

      return {
        success: true,
        message: "Request denied successfully",
      };
    } catch (error) {
      console.error("Deny request error:", error);
      throw error;
    }
  },
};

module.exports = owner_service;
