import Tag from "../models/Tag";


export const createBaseTags = async () => {
  const tags = await Tag.findAll();
  if (tags.length > 0) return;
  const tagsData = [
    {name: 'Fun'},
    {name: 'Learning'},
    {name: 'Javascript'},
    {name: 'React'},
    {name: 'Node'},
    {name: 'Tv Shows'},
    {name: 'Movies'},
    {name: 'Music'},
    {name: 'Fitness'},
    {name: 'Mental Health'},
    {name: 'Productivity'},
    {name: 'Self-Care'},
    {name: 'Hobbies'},
    {name: 'Photography'},
    {name: 'Gaming'},
    {name: 'Fashion'},
    {name: 'Pets'},
    {name: 'History'},
    {name: 'Coding'},
    {name: 'Web Development'},
    {name: 'AI'},
    {name: 'Cryptocurrency'},
    {name: 'Cooking'},
    {name: 'DIY'},
    {name: 'News'},
    {name: 'Philosophy'},
    {name: 'Culture'},
    {name: 'Language Learning'},
    {name: 'Spirituality'}
  ]
  await Tag.bulkCreate(tagsData);
  console.log('Base Tags created');
}
