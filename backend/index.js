import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import "dotenv/config";

const app = express();

app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=31536000");
  next();
});

app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use("/images", express.static("backend/uploads"));

app.listen(5000, () => {
  console.log("Server up and running...");
});
