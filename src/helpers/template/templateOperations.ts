import { Op } from "sequelize"
import Question from "../../models/Question"


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
