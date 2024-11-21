const bcrypt = require("bcrypt");
const connection = require("../../../connection/connection");
const queries = require("../queries/users");

const users = {
  createAccount: async (
    owner_email,
    owner_password,
    first_name,
    last_name,
    nid,
    permanent_address,
    contact_number,
    occupation
  ) => {
    try {
      const hashedPassword = await bcrypt.hash(owner_password, 10);

      // Insert owner into the database
      const [insertResult] = await connection.query(queries.createAccount, [
        owner_email,
        hashedPassword,
        first_name,
        last_name,
        nid,
        permanent_address,
        contact_number,
        occupation,
      ]);

      // Get the inserted user's ID
      const insertedUserId = insertResult.insertId;

      // Fetch the newly inserted user's data using the ID
      const [userData] = await connection.query(queries.getUserById, [
        insertedUserId,
      ]);

      // Return the fetched user data
      return userData[0]; // Return first (and only) user from result set
    } catch (error) {
      console.error("Create account error:", error);
      throw error;
    }
  },
  loginByEmail: async (owner_email, owner_password) => {
    try {
      // Fetch owner from the database
      const [ownerData] = await connection.query(queries.loginByEmail, [
        owner_email,
      ]);

      // Check if user exists
      if (ownerData.length === 0) {
        return null; // User not found
      }

      const owner = ownerData[0];

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(
        owner_password,
        owner.owner_password
      );

      if (isPasswordValid) {
        // Remove password from user data before returning
        const { owner_password, ...ownerWithoutPassword } = owner;
        return ownerWithoutPassword;
      } else {
        return null; // Invalid password
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  existingCheck: async (owner_email) => {
    try {
      // Fetch owner from the database
      const [ownerData] = await connection.query(queries.existingCheck, [
        owner_email,
      ]);

      // Check if user exists
      if (ownerData.length === 0) {
        return false; // User does not exist
      } else {
        return true; // User exists
      }
    } catch (error) {
      console.error("Email check error:", error);
      throw error;
    }
  },
  getUserById: async (ownerId) => {
    try {
      const [owner] = await connection.query(queries.getUserById, [ownerId]);
      return owner[0] || null;
    } catch (error) {
      console.error("Get user details error:", error);
      throw error;
    }
  },
  updateInfo: async (fieldsToUpdate, owner_id) => {
    try {
      const updates = Object.keys(fieldsToUpdate)
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.values(fieldsToUpdate);

      const query = `
      UPDATE owners 
      SET ${updates}, 
          last_update_date = CURRENT_TIMESTAMP(), 
          change_number = change_number + 1 
      WHERE owner_id = ?`;

      const [updateResult] = await connection.query(query, [
        ...values,
        owner_id,
      ]);

      if (updateResult.affectedRows === 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Update user details error:", error);
      throw error;
    }
  },
  updatePassword: async (owner_id, currentPassword, newPassword) => {
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();

      const [user] = await conn.query(queries.getUserPassword, [owner_id]);
      if (user.length === 0) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user[0].owner_password
      );
      if (!isMatch) {
        return { success: false, message: "Current password is incorrect" };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await conn.query(queries.updatePassword, [hashedPassword, owner_id]);

      await conn.commit();
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      if (conn) await conn.rollback();
      console.error("Update password error:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = users;
