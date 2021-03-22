const pool = require('../config/db')
const { logger } = require('./logger')
const { addToDB, addCollectionToDB, editInDB, deleteFromDB, getAll, getFromField, updateCollectionInDB } = require('../helpers/database')
/**
 * This function returns an Abstract Controller object which can perform common DB functions
 * such as, get item by id, get all items, delete item, update item, create item
 */
class abstractController {
    constructor(tableName, itemName) {
        this.tableName = tableName
        this.itemName = itemName
    }

    async updateBulk(req, res) {
        const bulk = req.body.bulk
        try {
            await updateCollectionInDB(this.tableName, bulk)
            return res.status(200).json('Collection updated successfully')
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    }

    async addBulk(req, res) {
        const bulk = req.body.bulk
        try {
            await addCollectionToDB(this.tableName, bulk)
            return res.status(200).json('Collection added successfully')
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    }

    async getItem(req, res) {
        const id = req.params.id
        try {
            const row = await getFromField(this.tableName, 'id', id)
            return res.status(200).json(row)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server Error')
        }
    }
    async getAllItems(req, res) {
        try {
            const rows = await getAll(this.tableName)
            return res.status(200).json(rows)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    }
    async addItem(req, res) {
        try {
            const result = await addToDB(this.tableName, req.body, pool)
            await logger(req.session.userId, req.session.username, 'added', this.tableName)
            return res.status(200).json(`${this.itemName} added successfully`)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    }
    async editItem(req, res) {
        try {
            const result = await editInDB(this.tableName, req.body, pool)
            await logger(req.session.userId, req.session.username, 'edited', this.tableName)
            res.status(200).json(`${this.itemName} edited successfully`)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    }
    async deleteItem(req, res) {
        const id = req.body.id
        try {
            await deleteFromDB(this.tableName, id)
            await logger(req.session.userId, req.session.username, 'deleted', this.tableName)
            return res.status(200).json(`${this.itemName} deleted successfully`)
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    }
}

module.exports = abstractController
