import express from "express";
import {
  getOpinions,
  getOpinionById,
  createOpinion,
  updateOpinion,
  getUsers,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/opinions", getOpinions);
router.get("/users", getUsers);
router.get("/opinions/:id", getOpinionById);
router.post("/opinions", createOpinion);
router.patch("/opinions/:id", updateOpinion);

export default router;
