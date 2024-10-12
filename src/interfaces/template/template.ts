import { QuestionTypes } from "./question";

export type TemplateRequestFields = {
  title: string;
  userId: number;
  description: string;
  topicId: number;
  isPublic?: boolean;
  tags: number[];
  image?: string;
}

export type QuestionRequestFields = {
  title?: string;
  description?: string;
  visible?: boolean;
  type?: QuestionTypes;
}
