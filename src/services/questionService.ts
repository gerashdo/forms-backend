import Question from "../models/Question";


export const getQuestionsByTemplateId = async (templateId: number) => {
  const questions = await Question.findAll({
    where: {templateId},
    order: [['sequence', 'ASC']]
  });
  return questions;
}

export const getQuestions = async () => {
  const questions = await Question.findAll({
    order: [['sequence', 'ASC']]
  });
  return questions;
}
