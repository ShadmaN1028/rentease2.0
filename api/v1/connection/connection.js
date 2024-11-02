const mysql = require("mysql2");
require("dotenv").config();

const connectionPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 10,
});

module.exports = connectionPool.promise();
