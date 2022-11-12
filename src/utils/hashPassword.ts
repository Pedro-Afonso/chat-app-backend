import { hash, genSalt } from 'bcryptjs'

// Generate password hash
export const hashPassword = async (password: string) => {
  const salt = await genSalt()
  return hash(password, salt)
}
