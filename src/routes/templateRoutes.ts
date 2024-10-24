import { Router } from "express";
import { body, param, query } from "express-validator";
import fileUpload from 'express-fileupload';
import { addQuestionController, createTemplateController, deleteQuestionFromTemplateController, deleteTemplateController, getTemplateByIdController, getTemplatesBySubmissionsController, getTemplatesController, updateTemplateController, updateTemplateQuestionsSequenceController } from "../controllers/templateController";
import { checkValidations, isUserBlocked } from "../middlewares/userValidations";
import { validateJWT } from "../middlewares/validateJwt";
import { isAdminOrTemplateOwner } from "../middlewares/templateValidations";
import { noRepeatedIds, questionExists, templateExists, topicExists, userExists } from "../helpers/validators/utils";
import { QuestionTypes } from "../interfaces/template/question";
import { ALLOWED_TEMPLATE_ORDER_BY, ALLOWED_TEMPLATE_ORDER_BY_FIELDS } from "../constants/template";


const router = Router();

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}))

router.post("/",
  validateJWT,
  isUserBlocked,
  body("title").exists().isLength({min: 4}),
  body("userId").exists().isNumeric().custom(userExists),
  body("description").exists().isLength({min: 4}),
  body("topicId").exists().isNumeric().custom(topicExists),
  body("isPublic").optional().isBoolean(),
  checkValidations,
  createTemplateController
)

router.patch("/:templateId",
  validateJWT,
  isUserBlocked,
  isAdminOrTemplateOwner,
  param("templateId").exists().isNumeric().custom(templateExists),
  body("title").optional().isLength({min: 1}),
  body("description").optional().isLength({min: 1}),
  body("topicId").optional().isNumeric().custom(topicExists),
  body("isPublic").optional().isBoolean(),
  checkValidations,
  updateTemplateController
)

router.get("/bysubmissions",
  query("limit").optional().isNumeric(),
  query("order").optional().isString().isIn(Object.values(ALLOWED_TEMPLATE_ORDER_BY))
    .withMessage(`Invalid value for order. Valid values are: ${Object.values(ALLOWED_TEMPLATE_ORDER_BY).join(", ")}`),
  checkValidations,
  getTemplatesBySubmissionsController
)

router.get("/:templateId",
  param("templateId").exists().isNumeric().custom(templateExists),
  checkValidations,
  getTemplateByIdController
)

router.get("/",
  query("page").optional().isNumeric(),
  query("limit").optional().isNumeric(),
  query("orderBy").optional().isString().isIn(Object.values(ALLOWED_TEMPLATE_ORDER_BY_FIELDS))
    .withMessage(`Invalid value for orderBy. Valid values are: ${Object.values(ALLOWED_TEMPLATE_ORDER_BY_FIELDS).join(", ")}`),
  query("order").optional().isString().isIn(Object.values(ALLOWED_TEMPLATE_ORDER_BY))
    .withMessage(`Invalid value for order. Valid values are: ${Object.values(ALLOWED_TEMPLATE_ORDER_BY).join(", ")}`),
  query("userId").optional().isNumeric().custom(userExists),
  checkValidations,
  getTemplatesController
)

router.delete("/:templateId",
  validateJWT,
  isUserBlocked,
  isAdminOrTemplateOwner,
  param("templateId").exists().isNumeric().custom(templateExists),
  checkValidations,
  isAdminOrTemplateOwner,
  deleteTemplateController
)

router.post("/:templateId/questions",
  validateJWT,
  isUserBlocked,
  isAdminOrTemplateOwner,
  param("templateId").exists().isNumeric().custom(templateExists),
  body("title").exists().isLength({min: 1}),
  body("description").optional().isLength({min: 1}),
  body("visible").optional().isBoolean(),
  body("type").exists().isIn(Object.values(QuestionTypes)).withMessage(`Invalid question type. Valid types are: ${Object.values(QuestionTypes).join(", ")}`),
  checkValidations,
  addQuestionController
)

router.delete("/:templateId/questions/:questionId",
  validateJWT,
  isUserBlocked,
  isAdminOrTemplateOwner,
  param("templateId").exists().isNumeric().custom(templateExists),
  param("questionId").exists().isNumeric().custom(questionExists),
  checkValidations,
  deleteQuestionFromTemplateController
)

router.patch("/:templateId/reorder-questions",
  validateJWT,
  isUserBlocked,
  isAdminOrTemplateOwner,
  param("templateId").exists().isNumeric().custom(templateExists),
  body("questionsOrder").exists().isArray({min: 1})
    .withMessage("Questions order must be an array with at least one element")
    .custom(noRepeatedIds),
  checkValidations,
  updateTemplateQuestionsSequenceController
)

export default router;
