import { Router } from "express";
import { deleteFormController, getFormByIdController, getFormsController, submitFormController } from "../controllers/formController";
import { body, param, query } from "express-validator";
import { formExists, templateExists, userExists } from "../helpers/validators/utils";
import { checkValidations } from "../middlewares/userValidations";
import { allQuestionsExist, formAlreadySubmitted, isAdminOrFormOwner, verifyAllQuestionsAnswered } from "../middlewares/formValidations";
import { QuestionTypes } from "../interfaces/template/question";
import { ALLOWED_FORM_ORDER_BY, ALLOWED_FORM_ORDER_BY_FIELDS } from "../constants/form";
import { validateJWT } from "../middlewares/validateJwt";


const router = Router();

router.post("/submit",
  validateJWT,
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

router.get("/",
  query("page").optional().isNumeric(),
  query("limit").optional().isNumeric(),
  query("orderBy").optional().isString().isIn(Object.values(ALLOWED_FORM_ORDER_BY_FIELDS))
    .withMessage(`Order by must be one of ${Object.values(ALLOWED_FORM_ORDER_BY_FIELDS).join(', ')}`),
  query("order").optional().isString().isIn(Object.values(ALLOWED_FORM_ORDER_BY))
    .withMessage(`Order must be one of ${Object.values(ALLOWED_FORM_ORDER_BY).join(', ')}`),
  query("templateId").optional().isNumeric().custom(templateExists),
  query("userId").optional().isNumeric().custom(userExists),
  checkValidations,
  getFormsController
)

router.get("/:formId",
  param("formId").isNumeric().custom(formExists),
  checkValidations,
  getFormByIdController
);

router.delete("/:formId",
  validateJWT,
  param("formId").isNumeric().custom(formExists),
  checkValidations,
  isAdminOrFormOwner,
  deleteFormController
);

export default router;
