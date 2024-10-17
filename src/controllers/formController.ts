import { Request, Response } from "express";
import { getForm, submitForm } from "../services/formService";
import { handleControllerError } from "../helpers/errorHandler";
import { SubmitFormBody } from "../interfaces/form/form";


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
