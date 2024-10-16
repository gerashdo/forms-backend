import sequelize from "../db/config"
import { SubmitFormAnswer } from "../interfaces/form/form";
import { QuestionTypes } from "../interfaces/template/question";
import Answer from "../models/Answer";
import Form from "../models/Form";


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

export const getForm = async (formId: number) => {
  const form = await Form.findByPk(formId, {
    include: [
      {
        model: Answer,
        attributes: ['id', 'questionId', 'textValue', 'numberValue', 'booleanValue', 'multipleTextLineValue']  // Specify the fields you want from the Answer
      }
    ]
  });

  return form;
}
