import { Router } from "express";
import { body } from "express-validator";
import { createTemplateController } from "../controllers/templateController";
import { checkValidations } from "../middlewares/userValidations";
import { topicExists, userExists } from "../helpers/validators/utils";


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

export default router;
