const { getFromField } = require('../../helpers/database')
const tableName = 'menuItem'

const itemController = {
    listAllItemsInCategory: async(req, res) => {
        const id = req.params.id
        try {
            const rows = await getFromField(tableName, 'belongsTo', id)
            res.status(200).json(rows)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server Error')
        }
    }
}

module.exports = itemController