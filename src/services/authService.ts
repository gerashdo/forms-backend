import { comparePassword, encryptPassword } from "../helpers/passwordEncrypt"
import User from "../models/User"


export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({where: {email: email}})
  if (!comparePassword(password, user.password)) {
    throw new Error("Invalid password")
  }
  return user
}

export const registerUser = async (name: string, lastName: string, email: string, password: string) => {
  const encryptedPassword = encryptPassword(password)
  const user = await User.create({name, lastName, email, password: encryptedPassword})
  return user
}
