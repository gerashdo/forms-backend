import { Router } from "express";
import { body, param } from "express-validator";
import fileUpload from 'express-fileupload';
import { addQuestionController, createTemplateController, deleteQuestionFromTemplateController, getTemplateByIdController } from "../controllers/templateController";
import { checkValidations } from "../middlewares/userValidations";
import { questionExists, templateExists, topicExists, userExists } from "../helpers/validators/utils";
import { QuestionTypes } from "../interfaces/template/question";


const router = Router();

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}))

router.post("/",
  body("title").exists().isLength({min: 4}),
  body("userId").exists().isNumeric().custom(userExists),
  body("description").exists().isLength({min: 4}),
  body("topicId").exists().isNumeric().custom(topicExists),
  body("isPublic").optional().isBoolean(),
  checkValidations,
  createTemplateController
)

router.post("/:templateId/questions",
  param("templateId").exists().isNumeric().custom(templateExists),
  body("title").exists().isLength({min: 4}),
  body("description").optional().isLength({min: 4}),
  body("visible").optional().isBoolean(),
  body("type").exists().isIn(Object.values(QuestionTypes)).withMessage(`Invalid question type. Valid types are: ${Object.values(QuestionTypes).join(", ")}`),
  checkValidations,
  addQuestionController
)

router.get("/:templateId",
  param("templateId").exists().isNumeric().custom(templateExists),
  checkValidations,
  getTemplateByIdController
)

router.delete("/:templateId/questions/:questionId",
  param("templateId").exists().isNumeric().custom(templateExists),
  param("questionId").exists().isNumeric().custom(questionExists),
  checkValidations,
  deleteQuestionFromTemplateController
)

export default router;
