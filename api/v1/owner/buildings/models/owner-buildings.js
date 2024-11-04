const connection = require("../../../connection/connection");
const queries = require("../queries/owner-buildings");

const owner_buildings = {
  addBuilding: async (
    owner_id,
    building_name,
    address,
    vacant_flats,
    parking
  ) => {
    try {
      await connection.query(queries.addBuilding, [
        owner_id,
        building_name,
        address,
        vacant_flats,
        parking,
        owner_id,
        owner_id,
      ]);
      return { added: true, message: "new building added" };
    } catch (error) {
      console.error("new building add error:", error);
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new Error("Invalid owner ID or others");
      }
      throw error;
    }
  },
  getBuildings: async (owner_id) => {
    try {
      const [buildings] = await connection.query(queries.getBuildings, [
        owner_id,
      ]);
      return buildings;
    } catch (error) {
      console.error("Get buildings error:", error);
      throw error;
    }
  },

  updateBuilding: async (
    owner_id,
    building_id,
    building_name,
    address,
    vacant_flats,
    parking
  ) => {
    try {
      await connection.query(queries.updateBuilding, [
        building_name,
        address,
        vacant_flats,
        parking,
        owner_id,
        owner_id,
        building_id,
      ]);
      return { updated: true, message: "building updated" };
    } catch (error) {
      console.error("Updating building error:", error);
      throw error;
    }
  },
  deleteBuildings: async (owner_id, building_id) => {
    try {
      await connection.query(queries.deleteBuildings, [owner_id, building_id]);
      return { deleted: true, message: "building deleted" };
    } catch (error) {
      console.error("Deleting building error:", error);
      throw error;
    }
  },
  searchBuildings: async (searchTerm, owner_id) => {
    try {
      const searchPattern = `%${searchTerm}%`;
      const [results] = await connection.query(queries.searchBuildings, [
        searchPattern,
        searchPattern,
        owner_id,
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = owner_buildings;
