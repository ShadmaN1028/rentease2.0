const connection = require("../../../connection/connection");
const queries = require("../queries/owner-flats");

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
};

module.exports = owner_flats;
