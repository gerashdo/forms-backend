import { Router } from "express";
import { body } from "express-validator";
import { addQuestionController, createTemplateController } from "../controllers/templateController";
import { checkValidations } from "../middlewares/userValidations";
import { topicExists, userExists } from "../helpers/validators/utils";
import { QuestionTypes } from "../interfaces/template/question";


const router = Router();

router.post("/",
  body("title").exists().isLength({min: 4}),
  body("userId").exists().isNumeric().custom(userExists),
  body("description").exists().isLength({min: 4}),
  body("topicId").exists().isNumeric().custom(topicExists),
  body("isPublic").exists().isBoolean(),
  checkValidations,
  createTemplateController
)

router.post("/:templateId/questions",
  body("title").optional().isLength({min: 4}),
  body("description").optional().isLength({min: 4}),
  body("visible").optional().isBoolean(),
  body("type").optional().isIn(Object.values(QuestionTypes)).withMessage(`Invalid question type. Valid types are: ${Object.values(QuestionTypes).join(", ")}`),
  checkValidations,
  addQuestionController
)

export default router;
