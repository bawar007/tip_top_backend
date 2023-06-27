import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import multer from "multer";

import fs from "node:fs";
import path from "node:path";

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

app.delete("/delete", (req, res) => {
  const folder = req.query.s || "default"; // Odczytaj wartość parametru "s" z URL, jeśli nie ma, użyj domyślnego folderu
  const fileName = req.query.fileName;

  const filePath = `backend/uploads/${folder}/${fileName}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Wystąpił błąd podczas usuwania pliku:", err);
      res.status(500).json({ error: "Wystąpił błąd podczas usuwania pliku." });
    } else {
      res.json({ message: "Plik został pomyślnie usunięty." });
    }
  });
});

app.get("/files", (req, res) => {
  const uploadsPath = "backend/uploads";

  fs.readdir(uploadsPath, (err, folders) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Wystąpił błąd serwera." });
    }

    const filesData = folders.map((folder) => {
      const folderPath = path.join(uploadsPath, folder);
      const files = fs.readdirSync(folderPath);
      return { name: folder, table: files };
    });

    res.json({ files: filesData });
  });
});

app.use("/images", express.static("backend/uploads"));

app.listen(5000, () => console.log("Server up and running..."));
