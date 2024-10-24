

export const TEMPLATE_FIELDS_TO_RETURN = [
  'id',
  'title',
  'description',
  'image',
  'isPublic',
  'createdAt',
];

export const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg'];

export enum ALLOWED_TEMPLATE_ORDER_BY_FIELDS {
  createdAt = "createdAt",
}

export enum ALLOWED_TEMPLATE_ORDER_BY {
  ASC = "asc",
  DESC = "desc",
}
