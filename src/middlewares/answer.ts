import {Request, Response, NextFunction} from 'express';
import Answer from '../models/Answer';
import Question from '../models/Question';
import { handleControllerError } from '../helpers/errorHandler';
import { QuestionTypes } from '../interfaces/template/question';


export const validateAnswerType = async (req: Request, res: Response, next: NextFunction) => {
  let {value}: {value: string | boolean | number} = req.body;
  const {answerId} = req.params;
  try {
    const answer = await Answer.findByPk(Number(answerId));
    const question = await Question.findByPk(answer.questionId);
    if (question.type === QuestionTypes.INTEGER) {
      value = Number(value);
    } else if (question.type === QuestionTypes.BOOLEAN) {
      if (value === 'true') value = true;
      if (value === 'false') value = false;
    }
    if (
      question.type === QuestionTypes.TEXT && typeof value !== 'string' ||
      question.type === QuestionTypes.MULTIPLE && typeof value !== 'string' ||
      question.type === QuestionTypes.INTEGER && isNaN(value as number) ||
      question.type === QuestionTypes.BOOLEAN && typeof value !== 'boolean'
    ) {
      res.status(422).json({
        ok: false,
        errors: {value: {msg: 'The type of the value does not match the question type'}},
      });
    } else {
      next();
    }
  } catch (error) {
    handleControllerError(res, error);
  }
}
