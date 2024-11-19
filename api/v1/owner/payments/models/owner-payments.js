const connection = require("../../../connection/connection");
const queries = require("../queries/owner-payments");

const owner_payments = {
  getPaymentsList: async (owner_id) => {
    try {
      const [paymentsList] = await connection.query(queries.getPaymentsList, [
        owner_id,
        owner_id,
      ]);
      return paymentsList;
    } catch (error) {
      console.error("Get applications error:", error);
      throw error;
    }
  },
  getPaymentDetails: async (owner_id, payment_id) => {
    try {
      const [paymentsDetails] = await connection.query(
        queries.getPaymentDetails,
        [owner_id, payment_id]
      );
      return paymentsDetails;
    } catch (error) {
      console.error("Get applications error:", error);
      throw error;
    }
  },
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
  recordPayment: async (
    owner_id,
    tenancy_id,
    amount,
    payment_date,
    payment_type,
    status
  ) => {
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [result] = await conn.query(queries.recordPayment, [
        owner_id,
        tenancy_id,
        amount,
        payment_date,
        payment_type,
        status,
        owner_id,
        owner_id,
      ]);
      if (result.affectedRows === 0) {
        throw new Error("Payment recording failed");
      }
      await conn.query(queries.updateTenancy, [owner_id, tenancy_id]);
      await conn.commit();
      return {
        success: true,
        message: "payment recorded and tenancy updated",
      };
    } catch (error) {
      if (conn) await conn.rollback();
      console.error("recording payment error:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },
  getPartiallyPaidPayments: async (owner_id) => {
    try {
      const [partiallyPaidPayments] = await connection.query(
        queries.getPartiallyPaidPayments,
        [owner_id]
      );
      return partiallyPaidPayments;
    } catch (error) {
      console.error("Get partially paid payments error:", error);
      throw error;
    }
  },
  getUnPaidPayments: async (owner_id) => {
    try {
      const [unpaidPayments] = await connection.query(
        queries.getUnpaidPayments,
        [owner_id]
      );
      return unpaidPayments;
    } catch (error) {
      console.error("Get partially paid payments error:", error);
      throw error;
    }
  },
  updatePayments: async (
    amount,
    payment_type,
    status,
    owner_id,
    payment_id
  ) => {
    try {
      const [updateResult] = await connection.query(queries.updatePayments, [
        amount,
        payment_type,
        status,
        owner_id,
        payment_id,
        owner_id,
      ]);
      if (updateResult.affectedRows === 0) {
        throw new Error("Payment not found");
      }
      return {
        success: true,
        message: "Payment updated",
      };
    } catch (error) {
      console.error("Update payment error:", error);
      throw error;
    }
  },
};

module.exports = owner_payments;
