import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Opinion = db.define(
  "opinions",
  {
    imie: DataTypes.STRING,
    email: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    stars: DataTypes.INTEGER,
    public_data: DataTypes.STRING,
    status: DataTypes.STRING,
    answerFromAdmin: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export const Users = db.define(
  "users",
  {
    phone_number: DataTypes.INTEGER,
    imie: DataTypes.STRING,
    nazwisko: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    role: DataTypes.INTEGER,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    accesToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Opinion;

//role =
//1001 - default user
// 110 - admin
