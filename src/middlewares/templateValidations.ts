import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/auth/token";
import Template from "../models/Template";
import { UserRoles } from "../interfaces/auth/roles";


export const isAdminOrTemplateOwner = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const {user, params: {templateId}} = req;
  const template = await Template.findByPk(templateId);
  if (template.userId !== user.id && user.role !== UserRoles.ADMIN) {
    res.status(403).json({
      ok: false,
      errors: {auth: {msg: 'You are not allowed to perform this action'}},
    });
  } else {
    next();
  }
}
