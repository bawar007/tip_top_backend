import express from "express";
import {
  getOpinions,
  getOpinionByEmail,
  createOpinion,
  updateOpinion,
  getUsers,
  getUser,
  deleteOpinion,
  deleteFiles,
  getFilesStrukture,
  handleUpload,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/opinions", getOpinions);
router.get("/user", getUsers);
router.post("/login", getUser);
router.get("/opinions/:email", getOpinionByEmail);
router.post("/opinions", createOpinion);
router.patch("/opinions/:id", updateOpinion);
router.delete("/opinions/:id", deleteOpinion);

router.delete("/delete", deleteFiles);
router.get("/files", getFilesStrukture);
router.post("/upload", handleUpload);
export default router;
