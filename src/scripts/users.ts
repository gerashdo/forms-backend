import { encryptPassword } from "../helpers/passwordEncrypt";
import { UserRoles } from "../interfaces/auth/roles";
import User from "../models/User";


export const createBaseUsers = async () => {
  const userDB = await User.findAll();
  if (userDB.length > 0) return;
  const users = [
    {name: 'John', lastName:'Doe' , email: 'john@gmail.com', password: encryptPassword('123456'), role: UserRoles.ADMIN},
    {name: 'David', lastName: 'Edwards', email: 'david@gmail.com', password: encryptPassword('123456'), role: UserRoles.USER}
  ];
  await User.bulkCreate(users);
}
