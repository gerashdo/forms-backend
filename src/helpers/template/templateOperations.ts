import { Op } from "sequelize"
import Question from "../../models/Question"
import { QuestionTypes } from "../../interfaces/template/question"
import { QuestionRequestFields } from "../../interfaces/template/template"
import { addQuestionToTemplate } from "../../services/templateService"


export const createTwoBaseQuestions = async (templateId: number) => {
  const emailQuestion: QuestionRequestFields = {
    title: 'User email',
    type: QuestionTypes.TEXT,
    visible: true,
    description: 'Question to get the email of the user',
  }
  const nameQuestion: QuestionRequestFields = {
    title: 'User name',
    type: QuestionTypes.TEXT,
    visible: true,
    description: 'Question to get the full name of the user',
  }
  try {
    await Promise.all([
      addQuestionToTemplate(templateId, emailQuestion),
      addQuestionToTemplate(templateId, nameQuestion),
    ])
  } catch (error) {
    throw error
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
    )
  } catch (error) {
    throw error
  }
}
