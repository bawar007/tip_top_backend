import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import "dotenv/config";

const app = express();

// Przykład generowania klucza JWT
// function generateJWT(userId) {
//   const payload = {
//     login: userId,
//     // Dodaj inne informacje użytkownika, które chcesz zawrzeć w tokenie
//   };

//   const options = {
//     expiresIn: "1h", // Czas ważności tokena (np. 1 godzina)
//   };

//   const token = jwt.sign(payload, validApiKey, options);
//   return token;
// }

// const userId = "tip_top"; // Przykładowy identyfikator użytkownika
// const jwtToken = generateJWT(userId);
// console.log("JWT Token:", jwtToken);

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
