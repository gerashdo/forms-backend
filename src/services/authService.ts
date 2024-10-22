import User from "../models/User";
import { comparePassword, encryptPassword } from "../helpers/passwordEncrypt";
import { generateJWT } from "../helpers/auth/jwtoken";
import { ALLOWED_USER_ORDER_BY, ALLOWED_USER_ORDER_BY_FIELDS } from "../constants/user";
import { PatchUserBody } from "../interfaces/auth/user";


export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({where: {email: email}});
  if (!comparePassword(password, user.password)) {
    throw new Error("Invalid password");
  }
  const token = await generateJWT(user.id.toString());
  return {user, token};
}

export const registerUser = async (name: string, lastName: string, email: string, password: string) => {
  const encryptedPassword = encryptPassword(password);
  const user = await User.create({name, lastName, email, password: encryptedPassword});
  return user
}

export const getUsers = async (
  page: number,
  limit: number,
  orderBy: ALLOWED_USER_ORDER_BY_FIELDS,
  order: ALLOWED_USER_ORDER_BY,
) => {
  const users = await User.findAndCountAll({
    attributes: ['id', 'name', 'lastName', 'email', 'role', 'blocked'],
    limit: limit,
    offset: (page - 1) * limit,
    order: [[orderBy, order]],
  })

  return users;
}

export const getUserById = async (id: number) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'lastName', 'email', 'role', 'blocked']
  });
  return user;
}

export const updateUser = async (id: number, data: PatchUserBody) => {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");

  await user.update(data);
  return user;
}

export const renovateToken = async( user: User ) => {
  const token = await generateJWT(user.id.toString())
  return token
}
