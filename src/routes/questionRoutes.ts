import { Router } from "express";
import { query } from "express-validator";
import { getQuestionsController } from "../controllers/questionController";
import { checkValidations } from "../middlewares/userValidations";
import { templateExists } from "../helpers/validators/utils";

const router = Router();

router.get("/",
  query("templateId").optional().isNumeric().custom(templateExists),
  checkValidations,
  getQuestionsController,
)

export default router;
