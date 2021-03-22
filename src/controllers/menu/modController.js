const pool = require('../../config/db')
const { addToDB, getFromField, deleteFromDB, addCollectionToDB, getAll } = require('../../helpers/database')
const tableName = 'menuModifier'

const modController = {
  listAllAllergens: async (req, res) => {
    try {
      const result = await getFromField(tableName, 'type', 'allergen')
      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  },
  listAllInfos: async (req, res) => {
    try {
      const result = await getFromField(tableName, 'type', 'info')
      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  },
  listAllAdditives: async (req, res) => {
    try {
      const result = await getFromField(tableName, 'type', 'additive')
      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  }
}

module.exports = modController
