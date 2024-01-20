import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import "dotenv/config";

import nodemailer from "nodemailer";

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

app.post("/send-email", (req, res) => {
  const { data, email } = req.body;

  // Skonfiguruj transportera e-mail
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "bafar006@gmail.com", // Wprowadź swój adres e-mail Gmail
      pass: "vvffocslxecmyktw", // Wprowadź hasło do swojego konta Gmail
    },
  });

  // Utwórz e-mail
  const mailOptions = {
    from: `TIP-TOP`,
    to: "bafar006@gmail.com",
    subject: `${email} dodał nową opinię na TIP-TOP`,
    text: `Opinia: ${data}. Otwórz link aby dodać opinię na stronie: https://tiptoptestdomain.netlify.app/admin`,
  };

  // Wyślij e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      res.status(200).send("Email sent successfully");
    }
  });
});

app.listen(5000, () => {
  console.log("Server up and running...");
});
