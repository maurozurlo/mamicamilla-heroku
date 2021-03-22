const categoryContainer = document.getElementById("categories-container")
const itemsContainer = document.getElementById("items-container")

const getCollapsibleItem = item => {
  const { id, isActive, name, listOrder } = item
  //Container
  const art = document.createElement('li')
  art.classList.add("message", "is-mami")
  art.setAttribute('order', listOrder)
  art.setAttribute('db-id', id)
  //Header
  const container = document.createElement('div')
  container.setAttribute('id', `items-${id}`)
  container.classList.add('message-header')
  const title = document.createElement('div')
  title.innerText = name
  container.append(title)
  //Actions
  const btnCtr = document.createElement('div')
  btnCtr.classList.add('buttons', 'has-addons')
  const params = { id: id, url: 'items', name: name, item: item }
  btnCtr.append(createButton(['fas', 'fa-edit'], editRecord, params, 'edit'))
  btnCtr.append(createButton(getIsActive(isActive), changeRecordIsActive, params, 'update'))
  btnCtr.append(createButton(['far', 'fa-trash-alt'], deleteRecord, params, 'delete'))
  container.append(btnCtr)
  art.append(container)
  return art
}

const getCollapsibleCategory = category => {
  const { id, isActive, name, listOrder } = category
  //Container
  const art = document.createElement('li')
  art.classList.add("message", "is-mami")
  art.setAttribute('order', listOrder)
  art.setAttribute('db-id', id)
  //Header
  const container = document.createElement('div')
  container.setAttribute('id', `categories-${id}`)
  container.setAttribute('data-is-active', isActive)
  container.classList.add('message-header')
  const title = document.createElement('a')
  title.setAttribute('href', `#${id}-message`)
  title.setAttribute('data-action', 'collapse')
  title.innerText = name
  title.onclick = () => displayItemsForCategory(id)
  container.append(title)
  //Actions
  const btnCtr = document.createElement('div')
  btnCtr.classList.add('buttons', 'has-addons')
  const params = { id: id, url: 'categories', name: name, item: category }
  btnCtr.append(createButton(['fas', 'fa-edit'], editRecord, params, 'edit'))
  btnCtr.append(createButton(getIsActive(isActive), changeRecordIsActive, params, 'update'))
  btnCtr.append(createButton(['far', 'fa-trash-alt'], deleteRecord, params, 'delete'))
  container.append(btnCtr)
  //Collapsible
  const accordion = document.createElement('div')
  accordion.setAttribute('id', `${id}-message`)
  accordion.classList.add("message-body", "is-collapsible")
  //Handle children
  if (category.children) {
    const accordionContent = document.createElement('div')
    accordionContent.setAttribute('id', `${category.id}-accordion`)
    accordionContent.classList.add('ml-3')

    category.children.forEach(cat => {
      accordionContent.append(getCollapsibleCategory(cat))
    })
    accordion.append(accordionContent)
  }
  art.append(container)
  art.append(accordion)
  return art
}

const displayItemsForCategory = id => {
  document.getElementById('menu-reminder').style.display = 'none'

  itemsContainer.childNodes.forEach(child => {
    child.style.display = 'none'
  })
  const itemList = document.getElementById(`${id}-items`)
  if (itemList) itemList.style.display = 'block'
  document.getElementById('button-add-item').setAttribute('category', id)
}

const editRecord = params => {
  const { url, item } = params
  if (url === 'categories') openModal('catCreateModal', InitializeEditCategory, item)
  else openModal('itemCreateModal', InitializeEditItem, item)
}

const createButton = (icon, cb, params, action) => {
  const btn = document.createElement('button')
  btn.setAttribute('id', `${action}-${params.id}`)
  btn.classList.add('button')
  const i = document.createElement('i')
  icon.forEach(el => i.classList.add(el))
  btn.append(i)
  btn.onclick = () => cb(params)
  return btn
}

const changeRecordIsActive = async params => {
  const { id, url, name } = params
  const element = document.getElementById(`${url}-${id}`)
  const active = element.getAttribute('data-is-active')
  const bool = !Number(active)
  const icon = document.getElementById(`update-${id}`).firstChild
  const payload = {
    id: id,
    isActive: bool
  }
  const req = await fetch(`${baseURL}menu/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("authToken")
    },
    body: JSON.stringify(payload)
  })
  if (req.status === 200) {
    element.setAttribute('data-is-active', Number(bool))
    icon.className = ''
    getIsActive(bool).forEach(el => icon.classList.add(el))
    console.log(`Updated record for ${id} to ${bool}`)
  } else {
    alert(`Error trying to update ${name}`)
  }

}

const gatherMenu = async (openCategory) => {
  const menuReminder = document.getElementById('menu-reminder')
  categoryContainer.innerHTML = smallSpinner(128)
  itemsContainer.innerHTML = smallSpinner(128)
  //Request
  const req = await fetch(`${baseURL}menu/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("authToken")
    }
  })
  let menu = await req.json();
  if (req.status === 200) {
    categoryContainer.innerHTML = ""
    itemsContainer.innerHTML = ""
    drawCategories(menu.categories, categoryContainer)
    drawItemBelongsTo(menu.categories) //List for item creation/editing modal, avoid categories with children
    drawItemsInCloneMenu(menu.items)
    drawItems(menu.items, itemsContainer)
  }

  menuReminder.style.display = 'block'
  const categoryIdFromUrl = window.location.hash
  if (categoryIdFromUrl !== "") {
    let id = categoryIdFromUrl.slice(1, categoryIdFromUrl.length - 8)
    displayItemsForCategory(id)
  }
  //bulmaCollapsible.attach('.is-collapsible');
}

const drawItemsInCloneMenu = (items) => {
  const list = document.getElementById('item-add-list')

  items.forEach(item => {
    const opt = document.createElement('option')
    opt.value = JSON.stringify(item)
    opt.innerText = item.name
    list.append(opt)
  })
}

const drawItems = (items, container) => {
  //Create a new list with items divided by category
  const categories = {}
  items.forEach(item => {
    if (!item.belongsTo) return
    if (typeof categories[item.belongsTo] === 'undefined')
      categories[item.belongsTo] = []
    const category = categories[item.belongsTo]
    if (category.items) category.items.push(item)
    else category.items = [item]
  })
  const categoryList = Object.keys(categories)
  //Loop through categories
  for (let i = 0; i < categoryList.length; i++) {
    //Set up container
    const categoryContainer = document.createElement('div')
    categoryContainer.setAttribute('id', `${categoryList[i]}-items`)
    categoryContainer.style.display = 'none'
    container.append(categoryContainer)
    //Sort items in category
    const sortedItems = categories[categoryList[i]].items.sort(dynamicSort("listOrder"))
    //Loop through items in category
    for (let j = 0; j < sortedItems.length; j++) {
      const li = getCollapsibleItem(sortedItems[j])
      categoryContainer.append(li)
    }
    startSort(categoryContainer, 'items')
  }
}


const drawItemBelongsTo = (categories) => {
  const list = document.getElementById('item-belongsto')
  const listExisting = document.getElementById('item-add-belongsto')
  list.innerHTML = ""
  listExisting.innerHTML = ""
  const availableCategories = _.flattenDeep(categories.map(category => deepFind(null, category)))
  availableCategories.forEach(category => {
    const opt = document.createElement('option')
    opt.innerText = category.name
    opt.value = category.id
    list.append(opt)
    listExisting.append(opt.cloneNode(true))
  })
}

const deepFind = (parent, category) => {
  if (parent) category.name = `${parent.name} / ${category.name}`
  if (category.children) return category.children.map(children => deepFind(category, children))
  else return category
}

const drawCategories = (categories, container) => {
  const sortedCategories = categories.sort(dynamicSort("listOrder"))
  for (let i = 0; i < sortedCategories.length; i++) {
    const li = getCollapsibleCategory(sortedCategories[i])
    container.append(li)
  }

  const btn = document.createElement('button')
  btn.classList.add("button", "is-primary", "mt-3")
  btn.innerText = "Add new category"
  btn.onclick = () => openModal('catCreateModal', InitializeCreateCategory)
  container.append(btn)
  startSort(container, 'categories')
}

const getIsActive = active => {
  if (active) return ['fas', 'fa-play']
  return ['fas', 'fa-pause']
}

const startSort = (container, name) => {
  Sortable.create(container, {

    animation: 150,
    onEnd: function (evt) {
      reorderInBulk(name, container)
    }
  })
}

const reorderInBulk = async (name, container) => {
  const payload = { bulk: [] }
  container.childNodes.forEach((node, i) => {
    if (node.hasAttribute('db-id')) {
      payload.bulk.push({
        id: node.getAttribute('db-id'),
        listOrder: i
      })
    }
  })
  const req = await fetch(`${baseURL}menu/${name}/bulk`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("authToken")
    },
    body: JSON.stringify(payload)
  })
  if (req.status !== 200) alert(`Error trying to reorder ${name}`)
}


const deleteRecord = async params => {
  const { id, url, name } = params
  if (confirm(`Are you sure you want to delete ${name}? This cannot be undone`)) {
    const payload = {
      id: id
    }

    const req = await fetch(`${baseURL}menu/${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(payload)
    })
    if (req.status === 200) {
      alert(`${name} deleted successfully`)
      gatherMenu()
    } else {
      alert(`Error trying to delete ${name}`)
    }
  }
}

const createValueListForSelect = (allValues, itemValues) => {
  const flattenedArr = allValues.map(val => val.value)
  const itemToCheck = itemValues.split(",")
  const cleanArr = flattenedArr.filter(val => itemToCheck.includes(val))
  return { value: cleanArr }
}

const populateItemSelects = (modifiers) => {
  itemAllMods.value = modifiers
  document.getElementById("item-mods-select").innerHTML = ""
  document.getElementById("item-infos-select").innerHTML = ""
  //Options
  const mods = [{ value: "1", label: "mit Farbstoff" }, { value: "2", label: "mit Konservierungsstoffen" }, { value: "3", label: "mit Antioxidationsmitteln" }, { value: "4", label: "mit Geschmacksverstärker" }, { value: "5", label: "geschwärzt" }, { value: "7", label: "mit Phosphat" }, { value: "8", label: "mit Süßungsmittel" }, { value: "9", label: "enthält eine Phenylalaninquelle" }, { value: "10", label: "gewachst" }, { value: "11", label: "mit Nitritpökelsalz" }, { value: "12", label: "Tartrazin" }, { value: "13", label: "koffeinhaltig" }, { value: "14", label: "chininhaltig" }, { value: "15", label: "genetisch verändert" }, { value: "16", label: "mit Milcheiweiß" }, { value: "17", label: "mit Taurin" }, { value: "18", label: "alkoholhaltig" }, { value: "19", label: "Laktose" }, { value: "20", label: "Säuerungsmittel" }, { value: "21", label: "Unter Schutzatmosphäre verpackt" }, { value: "a", label: "glutenhaltiges Getreide" }, { value: "a1", label: "Weizen" }, { value: "a2", label: "Roggen" }, { value: "a4", label: "Hafer" }, { value: "a5", label: "Kamut oder Hybridstämme" }, { value: "b", label: "Krebstiere" }, { value: "c", label: "Eier und Eierzeugnisse" }, { value: "d", label: "Fisch und Fischerzeugnisse" }, { value: "e", label: "Erdnüsse und Erdnusserzeugnisse" }, { value: "f", label: "Sojabohnen und Sojabohnenerzeugnisse" }, { value: "g", label: "Milch und Milcherzeugnisse" }, { value: "h", label: "Schalenfrüchte und Schalenfruchterzeugnisse" }, { value: "h1", label: "Mandeln" }, { value: "h2", label: "Haselnüsse" }, { value: "h3", label: "Walnüsse" }, { value: "h4", label: "Cashewnüsse" }, { value: "h5", label: "Pecanüsse" }, { value: "h6", label: "Paranüsse" }, { value: "h7", label: "Pistazien" }, { value: "h8", label: "Macadamia- oder Queenslandnüsse" }, { value: "i", label: "Sellerie und Sellerieerzeugnisse" }, { value: "k", label: "Senf und Senferzeugnisse" }, { value: "l", label: "Sesamsamen und Sesamerzeugnisse" }, { value: "m", label: "Schwefeldioxid und Sulfite" }]

  const infos = [{ value: "scharf", label: 'Scharf' }, { value: "vegan", label: 'Vegan' }, { value: "veggie", label: 'Veggie' }, { value: "regional", label: 'Regional' }, { value: "bio", label: 'Bio' }]
  //In case we already had a few of them selected
  const selectedAdds = modifiers ? createValueListForSelect(mods, modifiers) : {}
  const selectedInfos = modifiers ? createValueListForSelect(infos, modifiers) : {}
  //Populating in case of existing mods
  itemInfos.value = modifiers ? createValueListForSelect(infos, modifiers).value.join(",") : ''
  itemMods.value = modifiers ? createValueListForSelect(mods, modifiers).value.join(",") : ''

  const classNames = {
    select: "select-pure__select",
    dropdownShown: "select-pure__select--opened",
    multiselect: "select-pure__select--multiple",
    label: "select-pure__label",
    placeholder: "select-pure__placeholder",
    dropdown: "select-pure__options",
    option: "select-pure__option",
    autocompleteInput: "select-pure__autocomplete",
    selectedLabel: "select-pure__selected-label",
    selectedOption: "select-pure__option--selected",
    placeholderHidden: "select-pure__placeholder--hidden",
    optionHidden: "select-pure__option--hidden",
  }

  new SelectPure("#item-mods-select", {
    ...selectedAdds,
    options: mods,
    multiple: true,
    autocomplete: true,
    icon: "fa fa-times",
    onChange: value => {
      itemMods.value = value.join(',')
      addToAllMods()
    },
    classNames: classNames
  })
  new SelectPure('#item-infos-select', {
    ...selectedInfos,
    options: infos,
    multiple: true,
    autocomplete: true,
    icon: "fa fa-times",
    onChange: value => {
      itemInfos.value = value.join(',')
      addToAllMods()
    },
    classNames: classNames
  })
}

const addToAllMods = () => {
  let currentMods = itemMods.value.split(",")
  let currentInfos = itemInfos.value.split(",")
  itemAllMods.value = [...currentMods, ...currentInfos].filter(el => el !== null).join(",")
}

populateItemSelects(null)
