const { Sequelize } = require("sequelize");

const db = new Sequelize(
  "m1261_app",
  "m1261_bawar008",
  "2Nf$FpL}WJqYUPh3IHVL8K>_x8R+Mb",

  {
    host: "mysql63.mydevil.net",
    dialect: "mysql",
  }
);

module.exports = db;
