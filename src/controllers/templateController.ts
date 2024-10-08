import { Request, Response } from "express";
import { createTemplate } from "../services/templateService";
import { handleControllerError } from "../helpers/errorHandler";


export const createTemplateController = async(req: Request, res: Response) => {
  const {title, userId, description, topicId, isPublic} = req.body;
  try {
    const template = await createTemplate({title, userId, description, topicId, isPublic});
    res.status(201).json({
      ok: true,
      data: template,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}
