// const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//    dialect: "mysql",
//    host: process.env.DB_HOST,
// });

// module.exports = sequelize;

const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const URL = process.env.ATLAS_URI

let _db;

const mongoConnect = (cb) => {
   MongoClient.connect(URL)
      .then((client) => {
         console.log("connected!");
         _db = client.db();
         cb(client);
      })
      .catch((err) => {
         console.log(err);
         throw err;
      });
};

const getDb = () => {
   if (_db) {
      return _db;
   }
   throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
