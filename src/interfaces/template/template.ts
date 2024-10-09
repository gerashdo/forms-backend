import { QuestionTypes } from "./question";

export type TemplateRequestFields = {
  title: string;
  userId: number;
  description: string;
  topicId: number;
  isPublic?: boolean;
}

export type QuestionRequestFields = {
  title?: string;
  description?: string;
  visible?: boolean;
  type?: QuestionTypes;
}
