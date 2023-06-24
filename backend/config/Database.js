import { Sequelize } from "sequelize";

const db = new Sequelize(
  "postgres://tip_admin:ehOAJHwygD5WYsOK166DRD4SFqPSK8t2@dpg-cibe1kp5rnuk9q8anov0-a.frankfurt-postgres.render.com/tip_top_db_ejjl?ssl=true"
);

export default db;
