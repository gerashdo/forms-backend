import { TemplateRequestFields } from "../interfaces/template/template";
import Question from "../models/Question";
import Tag from "../models/Tag";
import Template from "../models/Template";
import Topic from "../models/Topic";
import User from "../models/User";


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
