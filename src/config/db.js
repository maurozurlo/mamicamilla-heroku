const mysql = require('mysql2')
require('dotenv').config();


const pool = mysql.createPool(process.env.DATABASE_URL)

const promisePool = pool.promise();

console.log("DB connected")

module.exports = promisePool
