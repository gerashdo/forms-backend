import User from "../models/User";
import { comparePassword, encryptPassword } from "../helpers/passwordEncrypt";
import { generateJWT } from "../helpers/auth/jwtoken";


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

export const renovateToken = async( user: User ) => {
  const token = await generateJWT(user.id.toString())
  return token
}
