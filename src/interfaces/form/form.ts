import { QuestionTypes } from "../template/question";


export type SubmitFormBody = {
  userId: number;
  templateId: number;
  answers: SubmitFormAnswer[];
}

export type SubmitFormAnswer = {
  questionId: number;
  value: string | number | boolean;
  type: QuestionTypes;
}
