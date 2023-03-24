import express from "express";
import {
  getOpinions,
  getOpinionByEmail,
  createOpinion,
  updateOpinion,
  getUsers,
  deleteOpinion,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/opinions", getOpinions);
router.get("/user", getUsers);
router.get("/opinions/:email", getOpinionByEmail);
router.post("/opinions", createOpinion);
router.patch("/opinions/:email", updateOpinion);
router.delete("/opinions/:id", deleteOpinion);

export default router;
