import { Router } from "express";
import { body, param, query } from "express-validator";
import { getAnswersController, updateAnswerController } from "../controllers/answerController";
import { checkValidations } from "../middlewares/userValidations";
import { validateAnswerType } from "../middlewares/answer";
import { answerExists, formExists } from "../helpers/validators/utils";


const router = Router();

router.get("/",
  query("formId").optional().isNumeric().custom(formExists),
  checkValidations,
  getAnswersController
)

router.patch("/:answerId",
  param("answerId").isNumeric().custom(answerExists),
  body("value").exists(),
  checkValidations,
  validateAnswerType,
  updateAnswerController
)

export default router;
