import Topic from "../models/Topic";


export const createBaseTopics = async () => {
  const topicsDB = await Topic.findAll();
  if (topicsDB.length > 0) return;
  const topics = [
    {name: 'Education'},
    {name: 'Science'},
    {name: 'Technology'},
    {name: 'Health and Wellness'},
    {name: 'Social Issues'},
    {name: 'Environment'},
    {name: 'Marketing'},
    {name: 'Customer Feedback'},
    {name: 'Research'},
    {name: 'Community Engagement'},
    {name: 'Event Planning'},
    {name: 'Personal Development'},
    {name: 'Entertainment'},
    {name: 'Travel and Tourism'},
    {name: 'Career Development'},
    {name: 'Other'},
  ]
  await Topic.bulkCreate(topics);
}
