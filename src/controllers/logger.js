const pool = require('../config/db')
const { v4: uuidv4 } = require('uuid')
const dayjs = require('dayjs')
const tableName = 'logs'


const logger = async (userId, username, action, table) => {
  let item = 'undefined'
  let user = username ? username : 'Unknown'
  switch (table) {
    case 'bookings':
      item = 'booking'
      break
    case 'users':
      item = 'user'
      break
    case 'menuCategory':
      item = 'category'
      break
    case 'menuItem':
      item = 'dish/drink'
      break
    default:
      item = 'undefined'
  }

  const actionString = `${user} ${action} a ${item}`
  try {
    await logToDB(userId || -1, actionString)
  } catch (error) {
    console.log('Unable to log')
  }
}


const logToDB = async (userId, action) => {
  const conn = await pool.getConnection()
  const stmt = `insert into ${tableName} (id,user,action) values (?,?,?)`
  const [rows] = await conn.execute(stmt, [uuidv4(),userId,action])
  conn.release()
  console.log(`Logged ${action} performed by ${userId}`)
}

const getLogs = async maxLogs => {
  const conn = await pool.getConnection()
  const stmt = `SELECT action, DATE_FORMAT(timestamp, "%b %d %Y, %h:%i:%s %p") as timestamp FROM logs order by timestamp DESC limit ?`
  const [rows] = await conn.execute(stmt, [maxLogs])
  conn.release()
  return rows
}

module.exports = {
  logger,
  getLogs
}
