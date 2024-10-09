import { Router } from "express";
import { getAllTagsController } from "../controllers/tagController";

const router = Router();

router.get("/", getAllTagsController);

export default router;
