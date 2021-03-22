const router = require('express').Router();
const { menuController } = require('../controllers/menuController')
const modController = require('../controllers/menu/modController')
const itemController = require('../controllers/menu/itemController')
const { verifyToken } = require('../middleware/auth')
const abstractRouter = require('./abstractRouter')
//Auth
router.use(verifyToken)
//Level 4 or 5 of abstraction, whoosh
const getRoutes = (tableName, itemName) => {
    const aRouter = new abstractRouter(tableName, itemName)
    return aRouter.generateRoutes().bind(aRouter)
}
const mods = getRoutes('menuModifier', 'Mod')
const items = getRoutes('menuItem', 'Item')
const categories = getRoutes('menuCategory', 'Category')

//Mods
router.get('/mods/allergens', modController.listAllAllergens)
router.get('/mods/infos', modController.listAllInfos)
router.get('/mods/additives', modController.listAllAdditives)
router.use('/mods', mods)

//Items
router.get('/items/category/:id', itemController.listAllItemsInCategory)
router.use('/items', items)

//Categories
router.use('/categories', categories)

//Menu
router.get('/all', menuController.getFullMenu)
router.get('/generate', menuController.generatePDF)

module.exports = router
