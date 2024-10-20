import Answer from "../models/Answer";
import Question from "../models/Question";
import { QuestionTypes } from "../interfaces/template/question";


export const getAnswers = async (formId?: number) => {
  const where = {};
  if (formId) where['formId'] = formId;
  const answers = await Answer.findAll({
    where,
    attributes: ['id', 'textValue', 'numberValue', 'booleanValue', 'multipleTextLineValue', 'questionId'],
    include: [
      {model: Question, attributes: ['title', 'type', 'sequence']},
    ],
    order: [
      [Question, 'sequence', 'ASC']
    ]
  });

  return answers;
}

export const updateAnswer = async (answerId: number, value: string | number | boolean) => {
  const answer = await getAnswerById(answerId);
  const question = await Question.findByPk(answer.questionId);
  if (!answer || !question) throw new Error('Answer not found');
  if (question.type === QuestionTypes.TEXT) answer.textValue = value as string;
  if (question.type === QuestionTypes.INTEGER) answer.numberValue = value as number;
  if (question.type === QuestionTypes.BOOLEAN) answer.booleanValue = value as boolean;
  if (question.type === QuestionTypes.MULTIPLE) answer.multipleTextLineValue = value as string;
  await answer.save();
  return answer;
}

export const getAnswerById = async (answerId: number) => {
  const answer = await Answer.findByPk(answerId, {
    attributes: ['id', 'textValue', 'numberValue', 'booleanValue', 'multipleTextLineValue', 'questionId'],
    include: [
      {model: Question, attributes: ['title', 'type', 'sequence']},
    ],
  });
  return answer;
}
