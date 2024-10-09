import Tag from "../models/Tag";


export const getAllTags = async () => {
  const tags = await Tag.findAll();
  return tags;
}
