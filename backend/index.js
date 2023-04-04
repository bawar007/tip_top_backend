import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRoute);
// require("heroku-self-ping").default("https://bawar007.github.io/tip_top");

app.listen(5000, () => console.log("Server up and running..."));
