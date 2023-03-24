import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Opinion = db.define(
  "opinions",
  {
    imie: DataTypes.STRING,
    nazwisko: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    stars: DataTypes.INTEGER,
    public_data: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export const Users = db.define(
  "zleceniodawcy",
  {
    phone_number: DataTypes.INTEGER,
    imie: DataTypes.STRING,
    nazwisko: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Opinion;

(async () => {
  await db.sync();
})();
