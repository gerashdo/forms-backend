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
