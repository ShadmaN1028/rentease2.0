const connection = require("../../../connection/connection");
const queries = require("../queries/owner-flats");
const { v4: uuidv4 } = require("uuid");

const owner_flats = {
  addBuilding: async (
    building_id,
    flat_number,
    area,
    rooms,
    bath,
    balcony,
    description,
    status,
    rent,
    tenancy_type,
    owner_id
  ) => {
    try {
      await connection.query(queries.addFlats, [
        building_id,
        flat_number,
        area,
        rooms,
        bath,
        balcony,
        description,
        status,
        rent,
        tenancy_type,
        owner_id,
        owner_id,
      ]);
      return { added: true, message: "new flat added" };
    } catch (error) {
      console.error("new flat add error:", error);
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new Error("Invalid building ID or others");
      }
      throw error;
    }
  },
  getFlats: async (building_id) => {
    try {
      const [flats] = await connection.query(queries.getFlats, [building_id]);
      return flats;
    } catch (error) {
      console.error("Get flats error:", error);
      throw error;
    }
  },
  getFlatInfo: async (flats_id) => {
    try {
      const [flatInfo] = await connection.query(queries.getFlatInfo, [
        flats_id,
      ]);
      return flatInfo;
    } catch (error) {
      console.error("Get flats error:", error);
      throw error;
    }
  },
  updateFlat: async (
    flats_id,
    area,
    rooms,
    bath,
    balcony,
    description,
    status,
    rent,
    tenancy_type,
    owner_id
  ) => {
    try {
      await connection.query(queries.updateFlat, [
        area,
        rooms,
        bath,
        balcony,
        description,
        status,
        rent,
        tenancy_type,
        owner_id,
        flats_id,
      ]);
      return { updated: true, message: "flat updated" };
    } catch (error) {
      console.error("Updating flat error:", error);
      throw error;
    }
  },
  deleteFlats: async (flats_id) => {
    try {
      await connection.query(queries.deleteFlatCode, [flats_id]);
      await connection.query(queries.deleteFlats, [flats_id]);
      return { deleted: true, message: "flat deleted" };
    } catch (error) {
      console.error("Deleting flat error:", error);
      throw error;
    }
  },
  searchFlats: async (searchTerm) => {
    try {
      const searchPattern = `%${searchTerm}%`;
      const [results] = await connection.query(queries.searchFlats, [
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  },
  generateFlatCode: async (flats_id, owner_id) => {
    try {
      const code = uuidv4().slice(0, 8);
      const [results] = await connection.query(queries.generateFlatCode, [
        flats_id,
        code,
        owner_id,
        owner_id,
      ]);
      return results;
    } catch (error) {
      console.error("Generating flat code error:", error);
      throw error;
    }
  },
  checkExistingFlatCode: async (flats_id) => {
    try {
      // Fetch owner from the database
      const [code] = await connection.query(queries.checkExistingFlatCode, [
        flats_id,
      ]);

      // Check if user exists
      if (code.length === 0) {
        return false; // code does not exist
      } else {
        return true; // code exists
      }
    } catch (error) {
      console.error("code check error:", error);
      throw error;
    }
  },
  getFlatCode: async (flats_id) => {
    try {
      const [code] = await connection.query(queries.getFlatCode, [flats_id]);
      return code[0] || null;
    } catch (error) {
      console.error("Get flat code error:", error);
    }
  },
};

module.exports = owner_flats;
