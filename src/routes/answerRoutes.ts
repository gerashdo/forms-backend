import { Router } from "express";
import { body, param, query } from "express-validator";
import { getAnswersController, updateAnswerController } from "../controllers/answerController";
import { checkValidations } from "../middlewares/userValidations";
import { isAdminOrAnswerOwner, validateAnswerType } from "../middlewares/answer";
import { validateJWT } from "../middlewares/validateJwt";
import { answerExists, formExists } from "../helpers/validators/utils";


const router = Router();

router.get("/",
  query("formId").optional().isNumeric().custom(formExists),
  checkValidations,
  getAnswersController
)

router.patch("/:answerId",
  validateJWT,
  isAdminOrAnswerOwner,
  param("answerId").isNumeric().custom(answerExists),
  body("value").exists(),
  checkValidations,
  validateAnswerType,
  updateAnswerController
)

export default router;
