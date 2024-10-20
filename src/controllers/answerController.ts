import { Request, Response } from "express";
import { handleControllerError } from "../helpers/errorHandler";
import { getAnswers, updateAnswer } from "../services/answerService";


export const getAnswersController = async (req: Request, res: Response) => {
  const { formId } = req.query;
  try {
    const answers = await getAnswers(Number(formId) || undefined);
    res.status(200).json({
      ok: true,
      data: answers,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}

export const updateAnswerController = async (req: Request, res: Response) => {
  const {answerId} = req.params;
  const {value}: {value: string | boolean | number} = req.body;
  try {
    const answer = await updateAnswer(Number(answerId), value);
    res.status(200).json({
      ok: true,
      data: answer,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}
