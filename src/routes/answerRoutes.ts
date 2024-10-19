import { Router } from "express";
import { query } from "express-validator";
import { getAnswersController } from "../controllers/answerController";
import { checkValidations } from "../middlewares/userValidations";
import { formExists } from "../helpers/validators/utils";


const router = Router();

router.get("/",
  query("formId").optional().isNumeric().custom(formExists),
  checkValidations,
  getAnswersController
)

export default router;
