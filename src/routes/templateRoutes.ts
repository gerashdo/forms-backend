import { Router } from "express";
import { body, param } from "express-validator";
import fileUpload from 'express-fileupload';
import { addQuestionController, createTemplateController, getTemplateByIdController } from "../controllers/templateController";
import { checkValidations } from "../middlewares/userValidations";
import { templateExists, topicExists, userExists } from "../helpers/validators/utils";
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
  body("tags").exists().isArray({min: 1}),
  body("isPublic").optional().isBoolean(),
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

router.get("/:templateId",
  param("templateId").exists().isNumeric().custom(templateExists),
  checkValidations,
  getTemplateByIdController
)

export default router;
