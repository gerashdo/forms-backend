import { getNextQuestionSequenceNumber } from "../helpers/template/metadata";
import Question from "../models/Question";
import Tag from "../models/Tag";
import Template from "../models/Template";
import Topic from "../models/Topic";
import User from "../models/User";
import { QuestionRequestFields, TemplateRequestFields } from "../interfaces/template/template";


export const createTemplate = async (templateData: TemplateRequestFields) => {
  try {
    const templateCreated = await Template.create(templateData);
    const template = await getTemplateById(templateCreated.id);
    return template;
  }catch(err) {
    throw err;
  }
}

const getTemplateById = async (id: number) => {
  try {
    const template = await Template.findByPk(id, {
      attributes: ['id', 'title', 'description', 'image', 'isPublic', 'createdAt'],
      include: [
        {model: User, attributes: ['id', 'name', 'lastName', 'email']},
        {model: Topic, attributes: ['id', 'name']},
        {model: Tag, attributes: ['id', 'name']},
        {model: Question, attributes: ['id', 'title', 'description', 'type', 'visible', 'sequence']}
      ]
    });
    return template;
  }catch(err) {
    throw err;
  }
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
