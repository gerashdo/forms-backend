import { Includeable } from "sequelize";
import sequelize from "../db/config"
import Answer from "../models/Answer";
import Form from "../models/Form";
import Template from "../models/Template";
import User from "../models/User";
import { SubmitFormAnswer } from "../interfaces/form/form";
import { QuestionTypes } from "../interfaces/template/question";


export const submitForm = async (
  userId: number,
  templateId: number,
  answers: SubmitFormAnswer[]
) => {
  const transaction = await sequelize.transaction();

  try {
    const form = await Form.create({userId, templateId}, {transaction});

    const answerData = answers.map(answer => ({
      formId: form.id,
      questionId: answer.questionId,
      textValue: answer.type === QuestionTypes.TEXT ? answer.value as string : null,
      numberValue: answer.type === QuestionTypes.INTEGER ? answer.value as number : null,
      booleanValue: answer.type === QuestionTypes.BOOLEAN ? answer.value as boolean : null,
      multipleTextLineValue: answer.type === QuestionTypes.MULTIPLE ? answer.value as string : null,
    }))

    await Answer.bulkCreate(answerData, {transaction});
    form.submissionDate = new Date();
    await form.save({transaction});

    await transaction.commit();
    return await getForm(form.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export const getForm = async (formId: number, includeAnswers?: boolean) => {
  const includeQuery: Includeable[] = [
    {model: User, attributes: ['email', 'name', 'lastName']},
    {model: Template, attributes: ['title', 'description']},
  ];
  if (includeAnswers) {
    includeQuery.push({model: Answer, attributes: ['id', 'questionId', 'textValue', 'numberValue', 'booleanValue', 'multipleTextLineValue']});
  }
  const form = await Form.findByPk(formId, {
    include: includeQuery,
  });

  return form;
}

export const getForms = async (
  page: number,
  limit: number,
  orderBy: string,
  order: string,
  templateId?: number,
  userId?: number
) => {
  const where = {};
  if (templateId) where['templateId'] = templateId;
  if (userId) where['userId'] = userId;
  const forms = await Form.findAndCountAll({
    where,
    attributes: ['id', 'submissionDate'],
    include: [
      {model: User, attributes: ['email']},
      {model: Template, attributes: ['title']},
    ],
    offset: (page - 1) * limit,
    limit,
    order: [[orderBy, order]]
  });

  return forms;
}

export const deleteForm = async (formId: number) => {
  const form = await Form.findByPk(formId);
  if (!form) throw new Error('Form not found');
  await form.destroy();
}
