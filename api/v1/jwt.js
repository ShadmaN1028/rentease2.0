const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(tenant) {
  return jwt.sign(
    { user_id: tenant.user_id, user_email: tenant.user_email },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

function generateTokenOwner(owner) {
  return jwt.sign(
    {
      owner_id: owner.owner_id,
      owner_email: owner.owner_email,
      owner_username: owner.owner_username,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function verifyTokenOwner(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  generateTokenOwner,
  verifyTokenOwner,
};
