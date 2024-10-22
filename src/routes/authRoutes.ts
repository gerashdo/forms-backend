import { Router } from "express";
import { body, param, query } from "express-validator";
import { getUserByIdController, getUsersController, loginController, signUpController, updateUserController } from "../controllers/authController";
import { checkValidations, emailExists, isEmailUnique, isUserAdmin } from "../middlewares/userValidations";
import { validateJWT } from "../middlewares/validateJwt";
import { userExists } from "../helpers/validators/utils";
import { ALLOWED_USER_ORDER_BY, ALLOWED_USER_ORDER_BY_FIELDS } from "../constants/user";
import { UserRoles } from "../interfaces/auth/roles";


const router = Router()

router.post("/signup",
  body("name").exists().isLength({min: 1}),
  body("lastName").exists().isLength({min: 1}),
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

router.get("/users/:id",
  validateJWT,
  isUserAdmin,
  param("id").isNumeric().custom(userExists),
  checkValidations,
  getUserByIdController
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

router.patch("/users/:id",
  validateJWT,
  isUserAdmin,
  param("id").isNumeric().custom(userExists),
  body("name").optional().isLength({min: 1}),
  body("lastName").optional().isLength({min: 1}),
  body("email").optional().isEmail(),
  body("role").optional().isString().isIn(Object.values(UserRoles))
    .withMessage(`Invalid role. Allowed values: ${Object.values(UserRoles).join(", ")}`),
  body("blocked").optional().isBoolean(),
  checkValidations,
  updateUserController
)

export default router;
