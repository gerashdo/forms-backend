import Topic from "../models/Topic";


export const createBaseTopics = async () => {
  const topicsDB = await Topic.findAll();
  if (topicsDB.length > 0) return;
  const topics = [
    {name: 'Education'},
    {name: 'Science'},
    {name: 'Other'},
    // {name: 'History'},
    // {name: 'English'},
    // {name: 'Geography'},
    // {name: 'Computer Science'},
    // {name: 'Art'},
    // {name: 'Music'},
    // {name: 'Physical Education'},
    // {name: 'Religion'},
  ]
  await Topic.bulkCreate(topics);
}
