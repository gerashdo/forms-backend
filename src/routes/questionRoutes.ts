import { Router } from "express";
import { body, param, query } from "express-validator";
import { getQuestionsController, updateQuestionController } from "../controllers/questionController";
import { checkValidations } from "../middlewares/userValidations";
import { questionExists, templateExists } from "../helpers/validators/utils";
import { QuestionTypes } from "../interfaces/template/question";

const router = Router();

router.get("/",
  query("templateId").optional().isNumeric().custom(templateExists),
  checkValidations,
  getQuestionsController,
)

router.patch("/:questionId",
  param("questionId").isNumeric().custom(questionExists),
  body("title").optional().isLength({min: 4}),
  body("description").optional().isLength({min: 4}),
  body("visible").optional().isBoolean(),
  body("type").optional().isIn(Object.values(QuestionTypes)).withMessage(`Invalid question type. Valid types are: ${Object.values(QuestionTypes).join(", ")}`),
  checkValidations,
  updateQuestionController,
)

export default router;
