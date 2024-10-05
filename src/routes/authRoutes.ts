import { Router } from "express"
import { body } from "express-validator"
import { loginController, signUpController } from "../controllers/authController"
import { checkValidations, emailExists, isEmailUnique } from "../middlewares/userValidations"


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

export default router
