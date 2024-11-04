const express = require("express");
const router = express.Router();
const buildings = require("../models/owner-buildings");

const { verifyTokenOwner } = require("../../../jwt");
const isEmpty = require("is-empty");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }
  try {
    const decoded = verifyTokenOwner(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

router.post("/owner/add-building", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  const { building_name, address, vacant_flats, parking } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  if (
    isEmpty(building_name) ||
    isEmpty(address) ||
    isEmpty(vacant_flats) ||
    isEmpty(parking)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    if (isEmpty(req.user.owner_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyTokenOwner(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const result = await buildings.addBuilding(
      decoded.owner_id,
      building_name,
      address,
      vacant_flats,
      parking,
      decoded.owner_id,
      decoded.owner_id
    );
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error adding building:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/owner/buildings", authenticateUser, async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    if (isEmpty(req.user.owner_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyTokenOwner(token);
    if (decoded) {
      const building = await buildings.getBuildings(decoded.owner_id);
      return res.status(200).json({
        success: true,
        data: building,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.put(
  "/owner/building/:building_id",
  authenticateUser,
  async (req, res) => {
    const token = req.cookies.token;
    const { building_name, address, vacant_flats, parking } = req.body;
    const { building_id } = req.params;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    if (
      isEmpty(building_name) ||
      isEmpty(address) ||
      isEmpty(vacant_flats) ||
      isEmpty(parking)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = verifyTokenOwner(token);
      if (req.user.owner_id !== decoded.owner_id) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Unauthorized to edit",
        });
      }
      if (decoded) {
        const result = await buildings.updateBuilding(
          decoded.owner_id,
          building_id,
          building_name,
          address,
          vacant_flats,
          parking
        );
        return res.status(200).json({
          status: 200,
          success: true,
          ...result,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error updating building:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.delete(
  "/owner/building/:building_id",
  authenticateUser,
  async (req, res) => {
    const token = req.cookies.token;
    const { building_id } = req.params;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    try {
      if (isEmpty(req.user.owner_id)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized login" });
      }

      const decoded = verifyTokenOwner(token);
      if (req.user.owner_id !== decoded.owner_id) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized to delete" });
      }
      if (decoded) {
        const result = await buildings.deleteBuildings(
          decoded.owner_id,
          building_id
        );
        return res.status(200).json({
          success: true,
          ...result,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error deleting building:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.post("/owner/search", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  const searchTerm = req.query.q;
  try {
    if (isEmpty(req.user.owner_id)) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized login" });
    }

    const decoded = verifyTokenOwner(token);
    if (req.user.owner_id !== decoded.owner_id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized to search" });
    }
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Search term is required.",
      });
    }

    const results = await buildings.searchBuildings(
      searchTerm,
      decoded.owner_id
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Search results.",

      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error searching buildings.",
      error: error.message,
    });
  }
});

module.exports = router;
