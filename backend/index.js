import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import { getOpinions } from "./controllers/UserController.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRoute);

setInterval(() => {
  const r = express.Router();
  r.get("/opinions", getOpinions);
  console.log();
}, 10000);

app.listen(5000, () => console.log("Server up and running..."));
