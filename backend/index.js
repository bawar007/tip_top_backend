import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import multer from "multer";
import fs from "node:fs";

const app = express();

app.use(cors());
app.use(express.json());
app.use(UserRoute);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query.s || "default"; // Odczytaj wartość parametru "s" z URL, jeśli nie ma, użyj domyślnego folderu
    const uploadPath = `backend/uploads/${folder}`;

    // Tworzenie folderu, jeśli nie istnieje
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.post("/upload", upload.array("files"), (req, res) => {
  res.json({ message: "Plik został pomyślnie zapisany." });
});

app.use("/images", express.static("backend/uploads"));

app.listen(5000, () => console.log("Server up and running..."));
