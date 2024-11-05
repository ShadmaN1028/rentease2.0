const express = require("express");
const router = express.Router();
const flats = require("../models/owner-flats");

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

router.post(
  "/owner/add-flat/:building_id",
  authenticateUser,
  async (req, res) => {
    const token = req.cookies.token;
    const { building_id } = req.params;
    const {
      flat_number,
      area,
      rooms,
      bath,
      balcony,
      description,
      status,
      rent,
      tenancy_type,
    } = req.body;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    if (
      isEmpty(building_id) ||
      isEmpty(flat_number) ||
      isEmpty(area) ||
      isEmpty(rooms) ||
      isEmpty(bath) ||
      isEmpty(balcony) ||
      isEmpty(description) ||
      isEmpty(status) ||
      isEmpty(rent) ||
      isEmpty(tenancy_type)
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
      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      const result = await flats.addBuilding(
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
  }
);

router.get(
  "/owner/flats-list/:building_id",
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
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = verifyTokenOwner(token);
      if (decoded) {
        const flatsList = await flats.getFlats(building_id);
        return res.status(200).json({
          success: true,
          data: flatsList,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error fetching flats:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);
router.get("/owner/flats/:flats_id", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  const { flats_id } = req.params;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    if (isEmpty(req.user.owner_id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyTokenOwner(token);
    if (decoded) {
      const flatInfo = await flats.getFlatInfo(flats_id);
      return res.status(200).json({
        success: true,
        data: flatInfo,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching flat info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.put("/owner/flats/:flats_id", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  const {
    area,
    rooms,
    bath,
    balcony,
    description,
    status,
    rent,
    tenancy_type,
  } = req.body;
  const { flats_id } = req.params;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  if (
    isEmpty(area) ||
    isEmpty(rooms) ||
    isEmpty(bath) ||
    isEmpty(balcony) ||
    isEmpty(description) ||
    isEmpty(status) ||
    isEmpty(rent) ||
    isEmpty(tenancy_type)
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
    if (decoded) {
      const result = await flats.updateFlat(
        flats_id,
        area,
        rooms,
        bath,
        balcony,
        description,
        status,
        rent,
        tenancy_type,
        decoded.owner_id
      );
      return res.status(200).json({
        status: 200,
        success: true,
        ...result,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error updating flat:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.delete("/owner/flats/:flats_id", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  const { flats_id } = req.params;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    if (isEmpty(req.user.owner_id)) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized login" });
    }

    const decoded = verifyTokenOwner(token);

    if (decoded) {
      const result = await flats.deleteFlats(flats_id);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error deleting flat:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/owner/search-flats", authenticateUser, async (req, res) => {
  const token = req.cookies.token;
  const searchTerm = req.query.q;
  try {
    if (isEmpty(req.user.owner_id)) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized login" });
    }

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Search term is required.",
      });
    }

    const results = await flats.searchFlats(searchTerm);

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
      message: "Error searching flats.",
      error: error.message,
    });
  }
});

module.exports = router;
