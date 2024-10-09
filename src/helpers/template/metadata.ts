import Question from "../../models/Question";


export const getNextQuestionSequenceNumber = async (templateId: number) => {
  const maxSequence: number = await Question.max('sequence', {where: {templateId: templateId}}) || 0;
  return maxSequence + 1;
}
