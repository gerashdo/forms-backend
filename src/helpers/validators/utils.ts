import Answer from "../../models/Answer";
import Form from "../../models/Form";
import Question from "../../models/Question";
import Template from "../../models/Template";
import Topic from "../../models/Topic";
import User from "../../models/User";


export const userExists = async (id: number) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
}

export const topicExists = async (id: number) => {
  const topic = await Topic.findByPk(id);
  if (!topic) {
    throw new Error('Invalid value for the topic');
  }
}

export const templateExists = async (id: number) => {
  const template = await Template.findByPk(id);
  if (!template) {
    throw new Error('Template not found');
  }
}

export const questionExists = async (id: number) => {
  const question = await Question.findByPk(id);
  if (!question) {
    throw new Error('Question not found');
  }
}

export const noRepeatedIds = async (ids: number[]) => {
  const idsSet = new Set(ids);
  if (ids.length !== idsSet.size) {
    throw new Error("Ids must not be repeated");
  }
}

export const formExists = async (id: number) => {
  const form = await Form.findByPk(id);
  if (!form) {
    throw new Error('Form not found');
  }
}

export const answerExists = async (id: number) => {
  const answer = await Answer.findByPk(id);
  if (!answer) {
    throw new Error('Answer not found');
  }
}
