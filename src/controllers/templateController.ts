import { Request, Response } from "express";
import { addQuestionToTemplate, createTemplate, getTemplateById } from "../services/templateService";
import { handleControllerError } from "../helpers/errorHandler";


export const createTemplateController = async(req: Request, res: Response) => {
  const {title, userId, description, topicId, isPublic, tags} = req.body;
  try {
    const template = await createTemplate({title, userId, description, topicId, isPublic, tags});
    res.status(201).json({
      ok: true,
      data: template,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}

export const addQuestionController = async(req: Request, res: Response) => {
  const {templateId} = req.params;
  const {title, description, visible, type} = req.body;
  try {
    const question = await addQuestionToTemplate(Number(templateId), {title, description, visible, type});
    res.status(201).json({
      ok: true,
      data: question,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}

export const getTemplateByIdController = async(req: Request, res: Response) => {
  const {templateId} = req.params;
  try {
    const template = await getTemplateById(Number(templateId));
    res.status(200).json({
      ok: true,
      data: template,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}
