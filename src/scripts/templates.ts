import Tag from "../models/Tag";
import Template from "../models/Template";
import Topic from "../models/Topic";
import User from "../models/User";
import { createTemplate } from "../services/templateService";


export const createBaseTemplate = async () => {
  const user = await User.findOne();
  const topic = await Topic.findOne();
  const tag = await Tag.findOne();
  const templates = await Template.findAll();
  if (templates.length > 0) return;
  if (!user || !topic) return;
  const template = {
    title: 'Template 1',
    userId: user.id,
    description: 'This is a template',
    topicId: topic.id,
    isPublic: true,
    tags: [tag.id],
  }
  const templateCreated = await createTemplate(template);
  if (templateCreated) {
    console.log('Base Template created');
  }
}
