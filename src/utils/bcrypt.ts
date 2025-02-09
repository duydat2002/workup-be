import bcrypt from 'bcrypt'

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10)
}

export const verifyPassword = (password: string, hashPassword: string) => {
  return bcrypt.compareSync(password, hashPassword)
}
