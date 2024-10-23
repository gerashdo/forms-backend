import { Request, Response } from "express";
import { deleteForm, getForm, getForms, submitForm } from "../services/formService";
import { handleControllerError } from "../helpers/errorHandler";
import { SubmitFormBody } from "../interfaces/form/form";
import { ALLOWED_FORM_ORDER_BY, ALLOWED_FORM_ORDER_BY_FIELDS } from "../constants/form";


export const submitFormController = async (req: Request, res: Response) => {
  const { userId, templateId, answers }: SubmitFormBody = req.body;
  try {
    const form = await submitForm(userId, templateId, answers);
    res.status(201).json({
      ok: true,
      data: form,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}

export const getFormByIdController = async (req: Request, res: Response) => {
  const { formId } = req.params;
  try {
    const form = await getForm(Number(formId));
    res.status(200).json({
      ok: true,
      data: form,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}

export const getFormsController = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    orderBy = ALLOWED_FORM_ORDER_BY_FIELDS.submissionDate,
    order = ALLOWED_FORM_ORDER_BY.DESC,
    templateId,
    userId,
  } = req.query;
  try {
    const forms = await getForms(
      Number(page),
      Number(limit),
      orderBy as string,
      order as string,
      Number(templateId) || undefined,
      Number(userId) || undefined,
    );
    res.status(200).json({
      ok: true,
      data: forms.rows,
      meta: {
        total: forms.count,
        page: Number(page),
        elementsPerPage: Number(limit),
      }
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}

export const deleteFormController = async (req: Request, res: Response) => {
  const {formId} = req.params;
  try {
    await deleteForm(Number(formId));
    res.status(204).end();
  } catch (error) {
    handleControllerError(res, error);
  }
}
