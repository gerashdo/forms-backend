import { Op, Transaction } from "sequelize";
import { Request } from "express";
import Question from "../../models/Question";
import Template from "../../models/Template";
import { uploadFile } from "../uploadFile";
import { getNextQuestionSequenceNumber } from "./metadata";
import { QuestionTypes } from "../../interfaces/template/question";
import { QuestionRequestFields, TemplateRequestFields } from "../../interfaces/template/template";
import { ALLOWED_IMAGE_EXTENSIONS } from "../../constants/template";


export const createTwoBaseQuestions = async (template: Template, transaction?: Transaction) => {
  const emailQuestion: QuestionRequestFields = {
    title: 'User email',
    type: QuestionTypes.TEXT,
    visible: true,
    description: 'Question to get the email of the user',
  }
  const dateQuestion: QuestionRequestFields = {
    title: 'Date',
    type: QuestionTypes.TEXT,
    visible: true,
    description: 'Question to get the date of the submission',
  }
  try {
    const sequence = await getNextQuestionSequenceNumber(template.id);
    await Promise.all([
      Question.create({...emailQuestion, sequence, templateId: template.id}, {transaction}),
      Question.create({...dateQuestion, sequence: sequence + 1, templateId: template.id}, {transaction}),
    ]);
  } catch (error) {
    console.log('Error in createTwoBaseQuestions');
    throw error;
  }
}

export const reorderQuestionsAfterDelete = async (templateId: number, sequenceDeleted: number) => {
  try {
    await Question.decrement(
      'sequence',
      {
        by: 1,
        where: {templateId, sequence: {[Op.gt]: sequenceDeleted}},
      },
    );
  } catch (error) {
    throw error;
  }
}

export const getImageForTemplate = async (req: Request): Promise<string | null> => {
  if (req.files && req.files.image && !(req.files.image instanceof Array)) {
    return await uploadFile(req.files.image, ALLOWED_IMAGE_EXTENSIONS);
  }
  return null;
}

export const getDataToUpdate = (body: Partial<TemplateRequestFields>) => {
  const dataToUpdate: Partial<TemplateRequestFields> = {};

  if (body.title) dataToUpdate['title'] = body.title;
  if (body.description) dataToUpdate['description'] = body.description;
  if (body.isPublic !== undefined) dataToUpdate['isPublic'] = body.isPublic;
  if (body.topicId) dataToUpdate['topicId'] = body.topicId;
  if (body.tags.length > 0) dataToUpdate['tags'] = body.tags;
  if (body.image) dataToUpdate['image'] = body.image;

  return dataToUpdate;
}
