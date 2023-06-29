import Opinion, { Users } from "../models/UserModel.js";
import fs from "node:fs";
import path from "node:path";

export const getOpinions = async (req, res) => {
  try {
    const response = await Opinion.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getOpinionByEmail = async (req, res) => {
  try {
    const response = await Opinion.findOne({
      where: {
        email: req.params.email,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createOpinion = async (req, res) => {
  try {
    await Opinion.create(req.body);
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateOpinion = async (req, res) => {
  try {
    await Opinion.update(req.body, {
      where: {
        email: req.params.email,
      },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteOpinion = async (req, res) => {
  try {
    await Opinion.destroy({
      where: {
        email: req.params.id,
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
