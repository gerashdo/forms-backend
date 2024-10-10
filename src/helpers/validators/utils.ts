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
