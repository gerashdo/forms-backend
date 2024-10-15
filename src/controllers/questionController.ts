import { Request, Response } from "express";
import { getQuestionsByTemplateId, getQuestions } from "../services/questionService";
import { handleControllerError } from "../helpers/errorHandler";
import Question from "../models/Question";


export const getQuestionsController = async (req: Request, res: Response) => {
  const {templateId} = req.query;
  try {
    let questions: Question[];
    if (templateId) {
      questions = await getQuestionsByTemplateId(Number(templateId));
    } else {
      questions = await getQuestions();
    }
    res.status(200).json({
      ok: true,
      data: questions,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}
