const express = require("express");
const router = express.Router();
const users = require("../models/users");
const isEmpty = require("is-empty");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../../../jwt");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }
  try {
    const decoded = verifyToken(token);
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

router.post("/tenant/signup", async (req, res) => {
  const {
    user_email,
    user_password,
    first_name,
    last_name,
    nid,
    permanent_address,
    contact_number,
    occupation,
  } = req.body;

  // Validate the inputs
  if (
    isEmpty(user_email) ||
    isEmpty(user_password) ||
    isEmpty(first_name) ||
    isEmpty(last_name) ||
    isEmpty(nid) ||
    isEmpty(permanent_address) ||
    isEmpty(contact_number) ||
    isEmpty(occupation)
  ) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "All fields are required.",
    });
  }

  try {
    const existingCheck = await users.existingCheck(user_email);

    if (existingCheck) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: "Email already exists.",
      });
    }
    // Create the account and get the newly inserted user data
    const newUser = await users.createAccount(
      user_email,
      user_password,
      first_name,
      last_name,
      nid,
      permanent_address,
      contact_number,
      occupation
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Account created successfully.",
      data: newUser, // Send back the new user's data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error creating account.",
      error: error.message,
    });
  }
});

router.post("/tenant/login", async (req, res) => {
  const { user_email, user_password } = req.body;

  // Validate the inputs
  if (isEmpty(user_email) || isEmpty(user_password)) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Email and password are required.",
    });
  }

  try {
    // Attempt to login
    const user = await users.loginByEmail(user_email, user_password);

    if (user) {
      // Generate JWT token
      const token = generateToken(user);

      // Set the token as an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Login successful.",
        data: {
          user_id: user.user_id,
          user_name: user.user_name,
          user_email: user.user_email,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Invalid email or password.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error during login.",
      error: error.message,
    });
  }
});

router.post("/logout", (req, res) => {
  res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.get("/check-auth", (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "No token found" });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      // Token is valid
      return res.status(200).json({
        isAuthenticated: true,
        user: {
          user_id: decoded.user_id,
          user_email: decoded.user_email,
        },
      });
    } else {
      // Token is invalid
      return res
        .status(401)
        .json({ isAuthenticated: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ isAuthenticated: false, message: "Internal server error" });
  }
});

router.get("/tenant/user-info", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      const userDetails = await users.getUserById(decoded.user_id);
      if (userDetails) {
        return res.status(200).json({
          success: true,
          data: userDetails,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
});

router.put("/tenant/update-password", authenticateUser, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required.",
    });
  }

  try {
    const result = await users.updatePassword(
      req.user.user_id,
      currentPassword,
      newPassword
    );

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.put("/tenant/update-info", async (req, res) => {
  const token = req.cookies.token;
  const {
    first_name,
    last_name,
    nid,
    permanent_address,
    contact_number,
    occupation,
  } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  const fieldsToUpdate = {};

  // Only add fields that are not empty or undefined
  if (first_name) fieldsToUpdate.first_name = first_name;
  if (last_name) fieldsToUpdate.last_name = last_name;
  if (nid) fieldsToUpdate.nid = nid;
  if (permanent_address) fieldsToUpdate.permanent_address = permanent_address;
  if (contact_number) fieldsToUpdate.contact_number = contact_number;
  if (occupation) fieldsToUpdate.occupation = occupation;

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided to update.",
    });
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      const updatedUser = await users.updateInfo(
        fieldsToUpdate,
        decoded.user_id
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      }

      return res.status(200).json({
        success: true,
        message: "user information updated successfully",
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
