import { NextFunction, Request, Response,  } from "express";
import { validationResult } from "express-validator";
import User from "../models/User";
import { CustomRequest } from "../interfaces/auth/token";
import { UserRoles } from "../interfaces/auth/roles";


export const isEmailUnique = async (req: Request, res: Response, next: NextFunction) => {
  const {email} = req.body;
  const user = await User.findOne({where: {email: email}});
  if (user) {
    res.status(409).json({
      ok: false,
      errors: {email: {msg: 'Email already exists'}},
    });
  } else {
    next();
  }
}

export const emailExists = async (req: Request, res: Response, next: NextFunction) => {
  const {email} = req.body;
  const user = await User.findOne({where: {email: email}});
  if (!user) {
    res.status(404).json({
      ok: false,
      errors: {email: {msg: 'Email not found'}},
    });
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
    });
  }else{
    next();
  }
}

export const isUserAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if(!user || user.role !== UserRoles.ADMIN){
    res.status(403).json({
      ok: false,
      errors: {role: {msg: 'You are not allowed to perform this action'}}
    });
  } else {
    next();
  }
}

export const isUserBlocked = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if(!user || user.blocked){
    res.status(403).json({
      ok: false,
      errors: {status: {msg: 'Your account is blocked'}}
    });
  } else {
    next();
  }
}
