import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import "dotenv/config";

const app = express();

const PORT = Number(process.env.PROD_PORT);

app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use("/images", express.static("backend/uploads"));

app.listen(PORT, () => {
  console.log("Server up and running...");
});
