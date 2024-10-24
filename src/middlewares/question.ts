import { NextFunction, Response } from "express";
import { UserRoles } from "../interfaces/auth/roles";
import { CustomRequest } from "../interfaces/auth/token";
import Question from "../models/Question";
import Template from "../models/Template";


export const isAdminOrQuestionOwner = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  const questionId = req.params.questionId;
  const question = await Question.findByPk(questionId);
  const template = await Template.findByPk(question.templateId);

  if(!user || (user.role !== UserRoles.ADMIN && user.id !== template.userId)){
    res.status(403).json({
      ok: false,
      errors: {role: {msg: 'You are not allowed to perform this action'}}
    });
  } else {
    next();
  }
}
