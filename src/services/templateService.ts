import sequelize from "../db/config";
import Question from "../models/Question";
import Tag from "../models/Tag";
import Template from "../models/Template";
import Topic from "../models/Topic";
import User from "../models/User";
import Form from "../models/Form";
import { getNextQuestionSequenceNumber } from "../helpers/template/metadata";
import { createTwoBaseQuestions, reorderQuestionsAfterDelete } from "../helpers/template/templateOperations";
import { TEMPLATE_FIELDS_TO_RETURN } from "../constants/template";
import { QuestionRequestFields, TemplateRequestFields } from "../interfaces/template/template";
import { deleteFile } from "../helpers/uploadFile";


export const createTemplate = async (templateData: TemplateRequestFields) => {
  const { tags, ...rest } = templateData;
  const transaction = await Template.sequelize.transaction();
  try {
    const templateCreated = await Template.create(rest, {transaction});
    const templateTags = await Tag.findAll({where: {id: tags}});
    await templateCreated.addTags(templateTags, {transaction});
    await createTwoBaseQuestions(templateCreated, transaction);
    await transaction.commit();
    const template = await getTemplateById(templateCreated.id);
    return template;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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
    attributes: TEMPLATE_FIELDS_TO_RETURN,
    include: [
      {model: User, attributes: ['id', 'name', 'lastName', 'email']},
      {model: Topic, attributes: ['id', 'name']},
      {model: Tag, attributes: ['id', 'name'], through: {attributes: []}},
      {model: User, as: 'allowedUsers', attributes: ['email', "name", "lastName"], through: {attributes: []}},
      {model: Form, attributes: ['id', 'submissionDate']},
    ]
  });
  return template;
}

export const getTemplates = async (
  page: number,
  limit: number,
  orderBy: string,
  order: string,
  userId?: number
) => {
  const where = {};
  if (userId) where['userId'] = userId;

  const templates = await Template.findAndCountAll({
    where,
    attributes: TEMPLATE_FIELDS_TO_RETURN,
    include: [
      {model: User, attributes: ['id', 'name', 'lastName', 'email']},
      {model: Topic, attributes: ['id', 'name']},
      {model: Tag, attributes: ['id', 'name'], through: {attributes: []}},
      {model: User, as: 'allowedUsers', attributes: ['email', "name", "lastName"], through: {attributes: []}},
    ],
    offset: (page - 1) * limit,
    limit,
    order: [[orderBy, order]],
  });
  return templates;
}

export const getTemplatesBySubmissions = async (limit: number, order: string) => {
  const templates = await Template.findAll({
    include: [
      {model: Topic, attributes: ['id', 'name']},
      {model: Tag, attributes: ['id', 'name'], through: {attributes: []}},
      {model: Form, attributes: [], as: 'Forms', required: true, duplicating: false},
    ],
    attributes: [
      ...TEMPLATE_FIELDS_TO_RETURN,
      [sequelize.fn('COUNT', sequelize.col('Forms.id')), 'submissions'],
    ],
    group: ['Template.id'],
    order: [[sequelize.literal('submissions'), order]],
    limit,
  })

  return templates;
}

export const deleteTemplate = async (id: number) => {
  const template = await Template.findByPk(id);
  if (!template) throw new Error('Template not found');
  if (template.image) {
    const result = await deleteFile(template.image);
    if (!result) throw new Error('Error deleting image');
  }
  await template.destroy();
}

export const addQuestionToTemplate = async (templateId: number, questionData: QuestionRequestFields) => {
  try {
    const template = await Template.findByPk(templateId);
    if (!template) throw new Error('Template not found');
    const sequence = await getNextQuestionSequenceNumber(templateId);
    const question = await Question.create({...questionData, sequence, templateId});
    return question;
  }catch(err) {
    console.log('Error in addQuestionToTemplate');
    throw err;
  }
}

export const deleteQuestionFromTemplate = async (templateId: number, questionId: number) => {
  const questionToDelete = await Question.findOne({where: {id: questionId, templateId}});
  if (!questionToDelete) throw new Error('Question not found');
  await questionToDelete.destroy();
  reorderQuestionsAfterDelete(templateId, questionToDelete.sequence);
}
