import Tag from "../models/Tag";


export const createBaseTags = async () => {
  const tags = await Tag.findAll();
  if (tags.length > 0) return;
  const tagsData = [
    {name: 'Fun'},
    {name: 'Learning'},
    {name: 'Technology'},
    {name: 'Science'},
    {name: 'Javascript'},
    {name: 'React'},
    {name: 'Node'},
    {name: 'Tv Shows'},
    {name: 'Movies'},
    {name: 'Music'},
  ]
  await Tag.bulkCreate(tagsData);
  console.log('Base Tags created');
}
