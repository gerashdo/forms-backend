import { Request, Response } from "express";
import { handleControllerError } from "../helpers/errorHandler";
import { getAnswers } from "../services/answerService";


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
