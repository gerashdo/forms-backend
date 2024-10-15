import sequelize from "../db/config";
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

export const updateQuestionsSequence = async (templateId: number, questionsIdOrder: number[]) => {
  const transaction = await sequelize.transaction();
  try {
    await Promise.all(questionsIdOrder.map((questionId, index) => {
      return Question.update(
        { sequence: index + 1 },
        { where: { id: questionId, templateId }, transaction }
      );
    }));
    await transaction.commit();

    const updatedQuestions = await getQuestionsByTemplateId(templateId);
    return updatedQuestions;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateQuestion = async (questionId: number, questionData: Omit<Partial<Question>, "templateId" | "id">) => {
  const question = await Question.findByPk(questionId);
  if (!question) {
    throw new Error('Question not found');
  }
  await question.update(questionData);
  return question;
}
