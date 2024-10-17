import { Router } from "express";
import { getFormByIdController, submitFormController } from "../controllers/formController";
import { body, param } from "express-validator";
import { formExists, templateExists, userExists } from "../helpers/validators/utils";
import { checkValidations } from "../middlewares/userValidations";
import { allQuestionsExist, formAlreadySubmitted, verifyAllQuestionsAnswered } from "../middlewares/formValidations";
import { QuestionTypes } from "../interfaces/template/question";

const router = Router();

router.post("/submit",
  body("userId").exists().isNumeric().custom(userExists),
  body("templateId").exists().isNumeric().custom(templateExists),
  body("answers").exists().isArray().notEmpty(),
  body("answers.*.questionId").exists().isNumeric(),
  body("answers.*.value").exists(),
  body("answers.*.type").exists().isIn(Object.values(QuestionTypes))
    .withMessage(`Type must be one of ${Object.values(QuestionTypes).join(', ')}`),
  checkValidations,
  verifyAllQuestionsAnswered,
  allQuestionsExist,
  formAlreadySubmitted,
  submitFormController,
)

router.get("/:formId",
  param("formId").isNumeric().custom(formExists),
  checkValidations,
  getFormByIdController
);

export default router;
