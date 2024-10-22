import User from "../../models/User";


export type PatchUserBody = Omit<Partial<User>, 'id' | 'createdAt' | 'updatedAt' | 'password'>;
