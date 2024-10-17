import { Request, Response, NextFunction } from 'express';
import Question from '../models/Question';
import { handleControllerError } from '../helpers/errorHandler';
import { SubmitFormBody } from '../interfaces/form/form';
import Form from '../models/Form';


export const verifyAllQuestionsAnswered = async (req: Request, res: Response, next: NextFunction) => {
  const {answers, templateId}: SubmitFormBody = req.body;

  try {
    const questions = await Question.findAll({where: {templateId}});
    if (questions.length !== answers.length) {
      res.status(422).json({
        ok: false,
        errors: {answers: {msg: 'All questions must be answered'}},
      });
    } else {
      next();
    }
  } catch (error) {
    handleControllerError(error, res);
  }
}

export const allQuestionsExist = async (req: Request, res: Response, next: NextFunction) => {
  const {answers, templateId}: SubmitFormBody = req.body;
  const questions = await Question.findAll({where: {templateId}});
  const questionIds = questions.map(question => question.id);
  const answersIds = answers.map(answer => answer.questionId);

  try {
    if (!answersIds.every(answerId => questionIds.includes(answerId))) {
      res.status(422).json({
        ok: false,
        errors: {answers: {msg: 'There are questions that do not exist in the template'}},
      });
    } else {
      next();
    }
  } catch (error) {
    handleControllerError(error, res);
  }
}

export const formAlreadySubmitted = async (req: Request, res: Response, next: NextFunction) => {
  const {userId, templateId}: SubmitFormBody = req.body;
  const form = await Form.findOne({where: {userId, templateId}});
  if (form) {
    res.status(422).json({
      ok: false,
      errors: {form: {msg: 'Form already submitted'}},
    });
  } else {
    next();
  }
}
