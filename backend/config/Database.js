import { Sequelize } from "sequelize";

const db = new Sequelize(
  "postgres://tip_top_db_k2nd_user:Xl8XX1gQxwCXGd4FKfi3SQ9ycpVKpRMb@dpg-cl8h9pauuipc73eqtseg-a.frankfurt-postgres.render.com/tip_top_db_k2nd?ssl=true"
);

export default db;
