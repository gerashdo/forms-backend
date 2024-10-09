import Topic from "../models/Topic";


export const getAllTopics = async () => {
  const topics = await Topic.findAll();
  return topics;
}
