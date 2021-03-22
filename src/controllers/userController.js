require('dotenv').config({ path: "./.env" });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const { hashPassword } = require('../helpers/encryption')
const { addToDB, deleteFromDB } = require('../helpers/database')
const { toCreateUser } = require('../transformers/users')
const { logger } = require('../controllers/logger')
const tableName = 'users'

const findUserByUsername = async username => {
    const [rows] = await pool.execute('SELECT * FROM `users` WHERE `username` = ?', [username])
    return rows.length === 0 ? true : false
}

const updateLastActivity = async username => {
    await pool.execute('UPDATE `users` SET `lastActive` = NOW() WHERE username = ?', [username]);
    console.log(`User ${username} logged in at ${new Date()}`)
}

const assertUserData = async (username, password) => {
    //
    const hashedPassword = await hashPassword(password)
    const [rows, fields] = await pool.execute('SELECT * FROM `users` WHERE `username` = ?', [username]);
    //User not found
    if (rows.length === 0) throw "User not found"
    //Check password
    const passwordCheck = await bcrypt.compare(password, rows[0].password)
    if (!passwordCheck) throw "Wrong password"
    return { id: rows[0].id }
}

const updateUserData = async (id, username, password) => {
    const hashedPassword = await hashPassword(password)
    const [rows, fields] = await pool.execute('UPDATE `users` SET `username` = ?, `password` = ? WHERE id = ?', [username, hashedPassword, id]);
}

const userController = {
    register: async (req, res) => {
        //Check for missing data
        const { password, username } = req.body
        if (!password || !username) return res.status(400).json('Missing data')
        //Check for duplicate username
        try {
            const uniqueUser = await findUserByUsername(username)
            if (!uniqueUser) return res.status(400).send({ message: 'More than one user with the same name' })
            const userData = await toCreateUser(req.body)
            const result = await addToDB(tableName, userData, pool)
            await logger(req.session.userId, req.session.username, 'added', tableName)
            return res.status(200).json({ message: 'User created successfully' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error })
        }
    },
    login: async (req, res) => {
        const { username, password } = req.body
        //Check for missing data
        if (!password || !username) return res.status(400).json('Missing data')
        //Check if user exists
        try {
            const user = await assertUserData(username, password)
            await updateLastActivity(username)
            const token = jwt.sign({ id: user.id, username: username }, process.env.JWT_SECRET, {
                expiresIn: 86400,
            })
            return res.status(200).json({ auth: true, token, message: 'User found & logged in' })
        } catch (error) {
            return res.status(400).json({ message: JSON.stringify(error) })
        }
    },
    update: async (req, res) => {
        const { id, username, password, newUsername, newPassword } = req.body
        if (id !== req.userId) return res.status(403).json('User id mismatch')

        try {
            const user = await assertUserData(username, password)
            const update = await updateUserData(id, newUsername, newPassword)
            return res.status(200).json('User updated successfully')
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    delete: async (req, res) => {
        const { id } = req.body
        if (id === req.session.userId) return res.status(403).json({ message: "Can't delete yourself" })
        try {
            const deleteUser = await deleteFromDB(tableName, id)
            await logger(req.session.userId, req.session.username, 'deleted', tableName)
            return res.status(200).json({ message: 'User deleted successfully' })
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}

module.exports = userController
