const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    second_name: DataTypes.STRING,
    date_createAccount: DataTypes.DATE,
    accesToken: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const Reports = db.define(
  "reports",
  {
    report_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    last_updateTime: DataTypes.DATE,
    number_of_reports: DataTypes.INTEGER,
    marker_id: DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const Markers = db.define(
  "markers",
  {
    marker_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    latitude: DataTypes.INTEGER,
    longitude: DataTypes.INTEGER,
    threats: DataTypes.STRING,
    description: DataTypes.STRING,
    date_createMarker: DataTypes.DATE,
    status: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    location: DataTypes.GEOMETRY("POINT"),
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Users.hasMany(Markers, { foreignKey: "user_id" });
Markers.belongsTo(Users, { foreignKey: "user_id" });

Reports.belongsTo(Markers, { foreignKey: "marker_id" });
// Markers.belongsTo(Reports, { foreignKey: "marker_id" });

module.exports = { Users, Reports, Markers };
