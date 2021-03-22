const { hashPassword } = require('../helpers/encryption')

const toCreateUser = async params => {
  const { password } = params
  const hashedPassword = await hashPassword(password)
  return {
    ...params,
    password: hashedPassword,
    lastActive: new Date(),
    createdAt: new Date()
  }
}

module.exports = {
  toCreateUser
}
