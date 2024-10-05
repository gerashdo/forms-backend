import bcrypt from 'bcrypt'


export const encryptPassword = (password: string): string  => {
  if (!password) return ''
  const salt = bcrypt.genSaltSync()
  return bcrypt.hashSync(password, salt)
}

export const comparePassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword)
}
