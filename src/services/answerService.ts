import Answer from "../models/Answer";
import Question from "../models/Question";


export const getAnswers = async (formId?: number) => {
  const where = {};
  if (formId) where['formId'] = formId;
  const answers = await Answer.findAll({
    where,
    attributes: ['id', 'textValue', 'numberValue', 'booleanValue', 'multipleTextLineValue'],
    include: [
      {model: Question, attributes: ['title', 'type', 'sequence']},
    ],
    order: [
      [Question, 'sequence', 'ASC']
    ]
  });

  return answers;
}
