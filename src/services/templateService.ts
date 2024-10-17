import Question from "../models/Question";
import Tag from "../models/Tag";
import Template from "../models/Template";
import Topic from "../models/Topic";
import User from "../models/User";
import { getNextQuestionSequenceNumber } from "../helpers/template/metadata";
import { createTwoBaseQuestions, reorderQuestionsAfterDelete } from "../helpers/template/templateOperations";
import { QuestionRequestFields, TemplateRequestFields } from "../interfaces/template/template";


export const createTemplate = async (templateData: TemplateRequestFields) => {
  const { tags, ...rest } = templateData;
  const templateCreated = await Template.create(rest);
  const templateTags = await Tag.findAll({where: {id: tags}});
  await templateCreated.addTags(templateTags);
  await createTwoBaseQuestions(templateCreated.id);
  const template = await getTemplateById(templateCreated.id);
  return template;
}

export const updateTemplate = async (templateId: number, templateData: Partial<TemplateRequestFields>) => {
  const template = await Template.findByPk(templateId);
  if (!template) throw new Error('Template not found');
  await template.update(templateData);
  if (templateData.tags) {
    const templateTags = await Tag.findAll({where: {id: templateData.tags}});
    await template.setTags(templateTags);
  }
  const updatedTemplate = await getTemplateById(templateId);
  return updatedTemplate;
}

export const getTemplateById = async (id: number) => {
  const template = await Template.findByPk(id, {
    attributes: ['id', 'title', 'description', 'image', 'isPublic', 'createdAt'],
    include: [
      {model: User, attributes: ['id', 'name', 'lastName', 'email']},
      {model: Topic, attributes: ['id', 'name']},
      {model: Tag, attributes: ['id', 'name'], through: {attributes: []}},
    ]
  });
  return template;
}

export const getTemplates = async (page: number, limit: number, orderBy: string, order: string) => {
  const templates = await Template.findAndCountAll({
    attributes: ['id', 'title', 'description', 'image', 'isPublic', 'createdAt'],
    include: [
      {model: User, attributes: ['id', 'name', 'lastName', 'email']},
      {model: Topic, attributes: ['id', 'name']},
      {model: Tag, attributes: ['id', 'name'], through: {attributes: []}},
    ],
    order: [[orderBy, order]],
    limit,
    offset: (page - 1) * limit,
  });
  return templates;
}

export const addQuestionToTemplate = async (templateId: number, questionData: QuestionRequestFields) => {
  try {
    const template = await Template.findByPk(templateId);
    if (!template) throw new Error('Template not found');
    const sequence = await getNextQuestionSequenceNumber(templateId);
    const question = await Question.create({...questionData, sequence, templateId});
    return question;
  }catch(err) {
    throw err;
  }
}

export const deleteQuestionFromTemplate = async (templateId: number, questionId: number) => {
  const questionToDelete = await Question.findOne({where: {id: questionId, templateId}});
  if (!questionToDelete) throw new Error('Question not found');
  await questionToDelete.destroy();
  reorderQuestionsAfterDelete(templateId, questionToDelete.sequence);
}
