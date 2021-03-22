const abstractController = require('../controllers/abstractController')
    /**
     * This function returns a Router with basic DB functionality already implemented.
     * Route: '/:id' Method: 'GET' Get an item by id
     * Route: '/' Method: 'GET' Get all items
     * Route: '/' Method: 'PUT' Update an item (make sure to include the id in req.body)
     * Route: '/' Method: 'DELETE' Delete an item (make sure to include the id in req.body)
     * Route: '/' Method: 'POST' Add an item (do not include id in req.body)
     * Route: '/bulk' Method: 'POST' Add several items (in a req.body.bulk array)
     */

class abstractRouter {
    constructor(tableName, itemName) {
        this.tableName = tableName
        this.itemName = itemName
    }

    generateRoutes(req, res) {
        const items = new abstractController(this.tableName, this.itemName)
        const router = require('express').Router()
        router.route('/')
            .get(items.getAllItems.bind(items))
            .post(items.addItem.bind(items))
            .delete(items.deleteItem.bind(items))
            .put(items.editItem.bind(items))
        router.post('/bulk', items.addBulk.bind(items))
        router.put('/bulk', items.updateBulk.bind(items))
        router.get('/:id', items.getItem.bind(items))
        return router
    }
}

module.exports = abstractRouter