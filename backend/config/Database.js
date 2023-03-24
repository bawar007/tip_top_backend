import { Sequelize } from "sequelize";

const db = new Sequelize(
  "postgres://tip_user:RPz37vCHRT3Q0YHxaMylJCMdmEYHLa9w@dpg-cgeca79mbg58c1eegno0-a.frankfurt-postgres.render.com/tip?ssl=true"
);

export default db;
