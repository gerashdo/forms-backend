import { Request, Response } from "express";
import { addQuestionToTemplate, createTemplate, deleteQuestionFromTemplate, getTemplateById, getTemplates } from "../services/templateService";
import { updateQuestionsSequence } from "../services/questionService";
import { handleControllerError } from "../helpers/errorHandler";
import { deleteFile, uploadFile } from "../helpers/uploadFile";
import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_TEMPLATE_ORDER_BY, ALLOWED_TEMPLATE_ORDER_BY_FIELDS } from "../constants/template";


export const createTemplateController = async (req: Request, res: Response) => {
  const {title, userId, description, topicId, isPublic} = req.body;
  const tags = JSON.parse(req.body.tags);
  let image: string | null = null;
  try {
    if (req.files && req.files.image && !(req.files.image instanceof Array)) {
      image = await uploadFile(req.files.image, ALLOWED_IMAGE_EXTENSIONS);
    }
    const template = await createTemplate({title, userId, description, topicId, isPublic, tags, image});
    res.status(201).json({
      ok: true,
      data: template,
    });
  } catch (error) {
    handleControllerError(res, error);
    if (image) {
      deleteFile(image);
      console.log('Image deleted');
    }
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

export const getTemplatesController = async(req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    orderBy = ALLOWED_TEMPLATE_ORDER_BY_FIELDS.createdAt,
    order = ALLOWED_TEMPLATE_ORDER_BY.DESC
  } = req.query;
  try {
    const templates = await getTemplates(Number(page), Number(limit), String(orderBy), String(order));
    res.status(200).json({
      ok: true,
      data: templates.rows,
      meta: {
        total: templates.count,
        page: Number(page),
        elementsPerPage: Number(limit),
      }
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

export const deleteQuestionFromTemplateController = async(req: Request, res: Response) => {
  const {templateId, questionId} = req.params;
  try {
    await deleteQuestionFromTemplate(Number(templateId), Number(questionId));
    res.status(204).json({});
  } catch (error) {
    handleControllerError(res, error);
  }
}

export const updateTemplateQuestionsSequenceController = async(req: Request, res: Response) => {
  const {templateId} = req.params;
  const {questionsOrder }= req.body;
  try {
    const result = await updateQuestionsSequence(Number(templateId), questionsOrder.map((id: number) => Number(id)));
    res.status(200).json({
      ok: true,
      data: result
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}
