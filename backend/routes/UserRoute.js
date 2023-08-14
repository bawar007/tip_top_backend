import express from "express";
import {
  getOpinions,
  getOpinionByEmail,
  createOpinion,
  updateOpinion,
  getUser,
  deleteOpinion,
  deleteFiles,
  getFilesStrukture,
  handleUpload,
  verifyUser,
} from "../controllers/UserController.js";

const router = express.Router();
//dd
router.get("/opinions", getOpinions);
router.post("/login", getUser);
router.get("/opinions/:email", getOpinionByEmail);
router.post("/opinions", createOpinion);
router.get("/verify", verifyUser);
router.patch("/opinions/:id", updateOpinion);
router.delete("/opinions/:id", deleteOpinion);

router.delete("/delete", deleteFiles);
router.get("/files", getFilesStrukture);
router.post("/upload", handleUpload);
export default router;
