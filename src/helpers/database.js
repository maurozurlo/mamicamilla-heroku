const { v4: uuidv4 } = require('uuid')
const pool = require('../config/db')

//Common operations //booking_settings
const getSetting = async settingName => {
    try {
        const conn = await pool.getConnection()
        const [value] = await conn.query('SELECT value FROM `settings` WHERE `name` LIKE ?', settingName)
        await conn.release()
        return value
    } catch (error) {
        console.error(error)
    }
}

const updateSetting = async (settingName, value) => {
    try {
        const conn = await pool.getConnection()
        const [setting] = await conn.execute('UPDATE `settings` set value = ? WHERE `name` LIKE ?', [JSON.stringify(value), settingName])
        await conn.release()

    } catch (error) {
        console.error(error)
    }
}

const getGenericCount = async (tableName) => {
    const [row] = await pool.execute(`SELECT COUNT(id) as count FROM ${tableName}`);
    return row[0].count
}
const getDistinctCount = async (tableName, field) => {
    const [row] = await pool.query(`SELECT COUNT(DISTINCT ${field}) AS count FROM ${tableName}`, [field]);
    return row[0].count
}

const getFromField = async (tableName, field, value) => {
    const [rows, fields] = await pool.execute(`SELECT * FROM ${tableName} WHERE ${field} = ?`, [value]);
    return rows
}

const getAll = async tableName => {
    const [rows, fields] = await pool.query(`SELECT * FROM ${tableName}`)
    return rows
}


const getFields = payload => {
    const fields = Object.keys(payload).join(',')
    const values = Object.values(payload)
    const questionMarks = values.map((item, index) => {
        return '?'
    }).join(',')
    const replacements = {
        values: values,
        fields: fields,
        qm: questionMarks,
    }
    return replacements
}

const getFieldsForUpdate = payload => {
    delete payload["id"] // Remove ID
    const fields = Object.keys(payload).join(' = ?, ')
    const values = Object.values(payload)
    const replacements = {
        values: values,
        fields: `${fields} = ?`
    }
    return replacements
}

const getFieldsWithId = payload => {
    const replacements = getFields(payload)
    // Generate Id
    replacements.values.unshift(uuidv4())
    // Add ? to question marks
    replacements.qm = `?,${replacements.qm}`
    // Add id field
    replacements.fields = `id,${replacements.fields}`
    return replacements
}

const addToDB = async (tableName, payload, connection) => {
    const rep = getFieldsWithId(payload)
    const stmt = `insert into ${tableName} (${rep.fields}) values (${rep.qm})`
    const [rows, fields] = await connection.execute(stmt, rep.values);
    return rows
}

const editInDB = async (tableName, payload, connection) => {
    const { id } = payload
    const rep = getFieldsForUpdate(payload)
    const stmt = `UPDATE ${tableName} SET ${rep.fields} WHERE id = ?`
    const [rows, fields] = await connection.execute(stmt, [...rep.values, id]);
    return rows
}

const deleteFromDB = async (tableName, id) => {
    const [rows, fields] = await pool.execute(`DELETE FROM ${tableName} WHERE id = ?`, [id])
    return rows
}

const updateCollectionInDB = async (tableName, collection) => {
    const conn = await pool.getConnection()
    await conn.query('begin;')
    for (let i = 0; i < collection.length; i++) {
        await editInDB(tableName, collection[i], conn)
    }
    await conn.query('commit;')
    conn.release()
    return true
}

const addCollectionToDB = async (tableName, collection) => {
    const conn = await pool.getConnection()
    await conn.query('begin;')
    for (let i = 0; i < collection.length; i++) {
        await addToDB(tableName, collection[i], conn)
    }
    await conn.query('commit;')
    conn.release()
    return true
}

module.exports = {
    addToDB,
    addCollectionToDB,
    editInDB,
    updateCollectionInDB,
    deleteFromDB,
    getFromField,
    getAll,
    getGenericCount,
    getDistinctCount,
    getSetting,
    updateSetting
}
