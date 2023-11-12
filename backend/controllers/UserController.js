import Opinion, { Users } from "../models/UserModel.js";
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";
import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getOpinions = async (req, res) => {
  try {
    const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
    const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

    if (apiKey !== validApiKey) {
      return res.status(401).json({ error: "Nieprawidłowy klucz API." });
    }

    const response = await Opinion.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getOpinionByEmail = async (req, res) => {
  try {
    const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
    const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

    if (apiKey !== validApiKey) {
      return res.status(401).json({ error: "Nieprawidłowy klucz API." });
    }
    const response = await Opinion.findOne({
      where: {
        email: req.params.email,
      },
    });

    if (!response) {
      res
        .status(404)
        .json({ error: "Email nie został znaleziony w bazie danych." });
    }

    res.status(200).json(response);
  } catch (error) {
    console.warn(error.message);
  }
};

export const getUser = async (req, res) => {
  const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
  const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

  if (apiKey !== validApiKey) {
    return res.status(401).json({ error: "Nieprawidłowy klucz API." });
  }

  try {
    const response = await Users.findOne({
      where: {
        login: req.body.login,
      },
    });
    if (response === null) {
      return res.status(404).json({ error: "Not found" });
    }

    // Wygeneruj sól (możesz dostosować liczbę rund)
    // const saltRounds = 10;
    // const salt = await bcrypt.genSalt(saltRounds);

    // // Zabezpiecz hasło przy użyciu bcrypt
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // console.log(hashedPassword);

    const verify = bcrypt.compareSync(req.body.password, response.password);

    if (verify) {
      const userToken = jwt.sign(
        {
          username: response.login,
          password: response.password,
          role: response.role,
        },
        process.env.JWT_SECRET, // Sekret używany do podpisywania tokenu
        { expiresIn: "1h" } // Czas wygaśnięcia tokenu
      );
      await Users.update(
        { accesToken: userToken },
        {
          where: {
            login: req.body.login,
          },
        }
      );
      res
        .status(201)
        .json({ msg: "User Finded", userToken, role: response.role });
    } else {
      return res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const verifyUser = async (req, res) => {
  const accesToken = req.headers.authorization.split(" ")[1];
  const body = jwt.verify(accesToken, process.env.JWT_SECRET);
  try {
    const user = await Users.findOne({
      where: {
        login: body.username,
        password: body.password,
        accesToken: accesToken,
      },
    });

    if (user === null) {
      return res.status(404).json({ msg: "not found" });
    }

    res.status(201).json({ msg: "Verify" });
  } catch (error) {
    res.status(401).json({ msg: "Unauthorize" });
    console.log(error.message);
  }
};

export const createOpinion = async (req, res) => {
  try {
    const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
    const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

    if (apiKey !== validApiKey) {
      return res.status(401).json({ error: "Nieprawidłowy klucz API." });
    }
    await Opinion.create(req.body);
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateOpinion = async (req, res) => {
  try {
    const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
    const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

    if (apiKey !== validApiKey) {
      return res.status(401).json({ error: "Nieprawidłowy klucz API." });
    }
    await Opinion.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteOpinion = async (req, res) => {
  try {
    const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
    const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

    if (apiKey !== validApiKey) {
      return res.status(401).json({ error: "Nieprawidłowy klucz API." });
    }
    await Opinion.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteFiles = async (req, res) => {
  const folder = req.query.s || "default"; // Odczytaj wartość parametru "s" z URL, jeśli nie ma, użyj domyślnego folderu
  const fileName = req.query.fileName;

  const filePath = `backend/uploads/${folder}/${fileName}`;

  const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
  const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

  if (apiKey !== validApiKey) {
    return res.status(401).json({ error: "Nieprawidłowy klucz API." });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Wystąpił błąd podczas usuwania pliku:", err);
      res.status(500).json({ error: "Wystąpił błąd podczas usuwania pliku." });
    } else {
      res.json({ message: "Plik został pomyślnie usunięty." });
    }
  });
};

export const getFilesStrukture = async (req, res) => {
  const uploadsPath = "backend/uploads";
  const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
  const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env
  if (apiKey !== validApiKey) {
    return res.status(401).json({ error: "Nieprawidłowy klucz API." });
  }

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
};

export const handleUpload = (req, res) => {
  const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
  const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

  if (apiKey !== validApiKey) {
    return res.status(401).json({ error: "Nieprawidłowy klucz API." });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = req.query.s || "default"; // Odczytaj wartość parametru "s" z URL, jeśli nie ma, użyj domyślnego folderu

      if (folder === "default")
        return res
          .status(500)
          .json({ error: "Wystąpił błąd podczas przesyłania plików." });

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

  upload.array("files")(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Wystąpił błąd podczas przesyłania plików." });
    }

    const apiKey = req.headers.authorization.split(" ")[1]; // Pobierz klucz API z nagłówka
    const validApiKey = process.env.API_KEY; // Pobierz prawidłowy klucz API z pliku .env

    if (apiKey !== validApiKey) {
      return res.status(401).json({ error: "Nieprawidłowy klucz API." });
    }

    res.json({ message: "Plik został pomyślnie zapisany." });
  });
};
