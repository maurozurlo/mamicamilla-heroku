const pool = require('../config/db')
const _ = require('lodash')
const pdf = require("html-pdf")
const ejs = require("ejs")
const fs = require("fs")


const dynamicSort = (property) => {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1)
  }
  return (a, b) => {
    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
    return result * sortOrder;
  }
}

const JSONTryParse = str => {
  try {
    let obj = JSON.parse(str)
    return obj
  } catch (error) {
    console.warn('Received malformed JSON')
    return {}
  }
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

//Cleanup methods
const populateSubCategories = (children, parents) => {
  children.forEach(child => {
    parents.forEach(parent => {
      if (child.belongsTo === parent.id) {
        if (!parent.children) {
          parent.children = []
          parent.children.push(child)
        } else {
          parent.children.push(child)
        }
      }
    })
  })
  return parents
}

const checkIfBelongsToMissingCategory = (element, categories) => {
  let missingCategory = true
  categories.forEach(category => {
    if (element.belongsTo === category) missingCategory = false
  })
  return missingCategory ? element : false
}

const cleanUpCategories = categories => {
  const availableCategories = categories.map(parent => parent.id)
  const children = categories.filter(cat => {
    return cat.belongsTo !== ''
  })
  const catList = populateSubCategories(children, categories).filter(cat => {
    return cat.belongsTo === '' || checkIfBelongsToMissingCategory(cat, availableCategories)
  })
  return catList
}

const deepFind = (parent, category) => {
  if (parent) category.name = `${parent.name} // ${category.name}`
  if (category.children) return category.children.map(children => deepFind(category, children))
  else return category
}

const addImgTags = mods => {
  const modsWithImages = ["scharf", "vegan", "veggie", "regional", "bio"]
  let csv = mods.split(',')
  for (let i = 0; i < csv.length; i++) {
    for (let j = 0; j < modsWithImages.length; j++) {
      if (csv[i] === modsWithImages[j])
        csv[i] = `<img class="info" src="/assets/img/${modsWithImages[j]}.svg" />`
    }
  }
  return csv.join(' ')
}
//You know the drill
const addItemsToCategories = (categories, items) => {
  const it = categories.map(category => {
    items.forEach(item => {
      if (category.id === item.belongsTo) {
        //Parse and destructuring
        const variants = JSONTryParse(item.variants)
        delete item.variants
        let formatter = new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR'
        })
        item.price = variants.price !== '' ? formatter.format(variants.price) : ''
        item.description += `. ${variants.amount || ''} ${variants.unit || ''}`
        //Add Img tag to mods
        item.modifiers = addImgTags(item.modifiers)
        if (typeof(category.items) === 'undefined') category.items = [item]
        else category.items.push(item)
      }
    })
    return category
  })
  return it
}

const cleanUpNames = categories => {
  categories.forEach(category => {
    //splitting
    const split = category.name.split(" // ")
    if (split.length === 1) {
      //No parent
      category.parent = 'Menü'
    } else { //Tricky bit
      let cleanName = split[split.length - 1]
      //category.parent = category.name.slice(0, cleanName.length + 4)
      category.parent = split[0]
      category.name = cleanName
    }
  })
  return categories
}

const getActiveMenu = async () => {
  try {
    const [categories] = await pool.query('SELECT * from menuCategory where isActive = true')
    const [items] = await pool.query('SELECT * from menuItem where isActive = true')
    return { categories, items }
  } catch (error) {
    console.error(error)
  }
}

const getMenu = async () => {
  try {
    const [categories] = await pool.query('SELECT * from menuCategory')
    const [items] = await pool.query('SELECT * from menuItem')
    return { categories, items }
  } catch (error) {
    console.error(error)
  }
}

const getFormattedMenu = async () =>{
    //1. Gather required info
    const { categories, items } = await getActiveMenu()
    //Add items to all active categories
    const it1 = addItemsToCategories(categories, items)
    //Sort by listOrder
    const it2 = it1.sort(dynamicSort("listOrder"))
    //Add children field
    const it3 = cleanUpCategories(it2)
    //Recursive magic to finish adding the children
    const it4 = _.flattenDeep(it3.map(category => deepFind(null, category)))
    //Clean up the category.name field and add category.parent
    const it5 = cleanUpNames(it4)
    //Remove categories with no items
    const it6 = it5.filter(cat => cat.items && cat.items.length >= 1)
    //TODO: Order items by ListOrder
    return it6
}

const menuController = {
  // Global menu
  getFullMenu: async (req, res) => {
    try {
      const { categories, items } = await getMenu()
      const _categories = cleanUpCategories(categories)
      return res.status(200).json({ categories: _categories, items })
    } catch (error) {
      console.log(error)
      return res.status(500).json('Server error')
    }
  },
  generatePDF: async (req, res) => {
    const categories = await getFormattedMenu()
    //Render the HTML
    const html = await ejs.renderFile(`${viewsDir}/templates/menu.ejs`, { categories })
    //Replace absolute paths
    const data = replaceAll(html, "/assets/", `file://${publicDir}/assets/`)
    //Create the PDF
    const options = {
      format: 'A4',
      border: {
        top: "5.28mm",
        right: "14.5mm",
        bottom: "14.5mm",
        left: "14.5mm"
      }
    }

    pdf.create(data, options).toFile(`${publicDir}/download/Menu.pdf`, function (err, data) {
      if (err) {
        console.error(err)
        res.status(500).send("Error generating PDF")
      } else {
        res.status(200).send("File created successfully");
      }
    })
  },
}

module.exports = {
  getFormattedMenu,
  menuController
}
