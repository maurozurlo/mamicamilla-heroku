const mysql = require('mysql2')
require('dotenv').config();

if(!process.env.DATABASE_URL) throw new Error("Missing Database URL")

const pool = mysql.createPool(process.env.DATABASE_URL)
const promisePool = pool.promise();

console.log("DB connected")

module.exports = promisePool
