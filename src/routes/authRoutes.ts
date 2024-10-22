import { Router } from "express"
import { body, query } from "express-validator"
import { getUsersController, loginController, signUpController } from "../controllers/authController"
import { checkValidations, emailExists, isEmailUnique, isUserAdmin } from "../middlewares/userValidations"
import { ALLOWED_USER_ORDER_BY, ALLOWED_USER_ORDER_BY_FIELDS } from "../constants/user"
import { validateJWT } from "../middlewares/validateJwt"


const router = Router()

router.post("/signup",
  body("name").exists().isLength({min: 3}),
  body("lastName").exists().isLength({min: 3}),
  body("email").isEmail(),
  body("password").exists().isLength({min: 6}),
  checkValidations,
  isEmailUnique,
  signUpController
)

router.post("/login",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").exists().withMessage("Password is required"),
  checkValidations,
  emailExists,
  loginController
)

router.get("/users",
  validateJWT,
  isUserAdmin,
  query("page").optional().isNumeric(),
  query("limit").optional().isNumeric(),
  query("orderBy").optional().isString().isIn(Object.values(ALLOWED_USER_ORDER_BY_FIELDS))
    .withMessage(`Invalid orderBy field. Allowed values: ${Object.values(ALLOWED_USER_ORDER_BY_FIELDS).join(", ")}`),
  query("order").optional().isString().isIn(Object.values(ALLOWED_USER_ORDER_BY))
    .withMessage(`Invalid order field. Allowed values: ${Object.values(ALLOWED_USER_ORDER_BY).join(", ")}`),
  getUsersController
)

export default router
