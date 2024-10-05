import { NextFunction, Request, Response,  } from "express"
import { validationResult } from "express-validator"
import User from "../models/User"


export const isEmailUnique = async (req: Request, res: Response, next: NextFunction) => {
  const {email} = req.body
  const user = await User.findOne({where: {email: email}})
  if (user) {
    res.status(409).json({
      ok: false,
      errors: {email: {msg: 'Email already exists'}},
    })
  } else {
    next()
  }
}

// export const userExists = async (req: Request, res: Response, next: NextFunction) => {
//   const {id} = req.params
//   const user = await User.findById(id)
//   if (!user) {
//     return res.status(404).json({
//       ok: false,
//       errors: {id: {msg: 'User not found'}},
//     })
//   }
//   next()
// }

export const emailExists = async (req: Request, res: Response, next: NextFunction) => {
  const {email} = req.body
  const user = await User.findOne({where: {email: email}})
  if (!user) {
    res.status(404).json({
      ok: false,
      errors: {email: {msg: 'Email not found'}},
    })
  } else {
    next();
  }
}

export const checkValidations = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({
      ok: false,
      errors: errors.mapped()
    })
  }else{
    next();
  }
}
