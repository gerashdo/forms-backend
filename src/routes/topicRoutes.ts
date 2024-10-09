import { Router } from "express";
import { getAllTopicsController } from "../controllers/topicController";

const router = Router();

router.get("/", getAllTopicsController);

export default router;
