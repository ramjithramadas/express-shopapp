const mysql = require("mysql2");

const pool = mysql.createPool({
   host: "localhost",
   user: "root",
   database: "express-shopapp",
   password: "Ramjith@mysql",
});

module.exports = pool.promise();
