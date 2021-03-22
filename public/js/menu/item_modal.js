const itemLoader = document.getElementById("item-loader")
//Elements
const itemTitle = document.getElementById("item-title")
const itemDescription = document.getElementById("item-description")
const itemECommerceUrl = document.getElementById("item-ecommerceurl")
const itemBelongsTo = document.getElementById("item-belongsto")
const itemListOrder = document.getElementById("item-order")
const itemIsActive = document.getElementById("item-isactive")
const itemId = document.getElementById("item-id")
const itemAllMods = document.getElementById("item-allmods")
const itemMods = document.getElementById("item-mods")
const itemInfos = document.getElementById("item-infos")
//Variants ///This should be split later...
const itemPrice = document.getElementById("item-price")
const itemAmount = document.getElementById("item-amount")
const itemUnit = document.getElementById("item-unit")



const InitializeAddItem = () => {
  const categoryIdFromUrl = window.location.hash
  if(categoryIdFromUrl !== ""){
    let id = categoryIdFromUrl.slice(1, categoryIdFromUrl.length - 8)
    document.getElementById("item-add-belongsto").value = id
  }
}

const addExistingItem = async (event) => {
  let btn = document.getElementById("item-existing-submit")
  event.preventDefault()
  const data = JSON.parse(document.getElementById('item-add-list').value)
  //Category
  let id = document.getElementById("item-add-belongsto").value
  delete data.id
  delete data.createdAt
  data.belongsTo = id
  if (Object.keys(data).length === 0) return

  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}menu/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("Item added")
      await gatherMenu()
      closeModal("itemExistingModal")
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}


const InitializeCreateItem = async () => {
  //Reset form
  itemTitle.value = ''
  itemDescription.value = ''
  itemBelongsTo.value = ''
  itemId.value = ''
  itemListOrder.value = ''
  itemECommerceUrl.value = ''
  itemPrice.value = ''
  itemAmount.value = ''
  itemUnit.value = ''
  itemAllMods.value = ''
  updateItemModal('create')
  populateItemSelects(null)
  populateBelongsToCategories()
}

const tryParseJSON = string => {
  try {
    let object = JSON.parse(string)
    return object
  } catch (error) {
    console.warn('Tried to parse a malformed json')
    return {}
  }
}

const InitializeEditItem = async params => {
  const { belongsTo, variants,
    description, icon, id,
    isActive, listOrder,
    modifiers, name,
    ecommerceUrl } = params

  const { price, unit, amount } = tryParseJSON(variants)
  itemTitle.value = name
  itemDescription.value = description
  itemBelongsTo.value = belongsTo
  itemIsActive.value = isActive
  itemId.value = id
  itemListOrder.value = listOrder
  itemECommerceUrl.value = ecommerceUrl
  itemPrice.value = price ? price : ''
  itemAmount.value = amount ? amount : ''
  itemUnit.value = unit ? unit : ''
  populateItemSelects(modifiers)
  updateItemModal('edit')
}

const populateBelongsToCategories = () => {
  const id = document.getElementById('button-add-item').getAttribute('category')
  if (id !== '')
    itemBelongsTo.value = id
}

const updateItemModal = action => {
  itemTitle.focus()
  const titleCase = action[0].toUpperCase() + action.slice(1)
  document.getElementById('item-modal-title').innerText = `${titleCase} item`
  const footer = document.getElementById('item-modal-footer')
  footer.innerHTML = ""
  const btn = document.createElement('button')
  btn.classList.add('button', 'is-success')
  btn.setAttribute('id', `${action}-item-btn`)
  if (action === 'create') btn.onclick = () => createItem(event)
  if (action === 'edit') btn.onclick = () => editItem(event)
  btn.innerText = `${titleCase} item`
  footer.append(btn)
}

const gatherItemData = () => {
  const data = {
    name: itemTitle.value,
    description: itemDescription.value,
    isActive: itemIsActive.value === '' ? 1 : itemIsActive.value, //Default active
    belongsTo: itemBelongsTo.value,
    ecommerceUrl: itemECommerceUrl.value,
    modifiers: itemAllMods.value,
    listOrder: itemListOrder.value === '' ? 99 : itemListOrder.value,
    variants: JSON.stringify({
      price: itemPrice.value,
      amount: itemAmount.value,
      unit: itemUnit.value
    })
  }
  // Validation
  if (data.name === "") {
    alert("You must enter a title")
    return {}
  }
  if (data.name.length >= 30) {
    alert("Title can't be longer than 30 characters")
    return {}
  }
  return itemId.value === '' ? data : { ...data, id: itemId.value };
}

const editItem = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("edit-item-btn")
  const data = gatherItemData()
  if (Object.keys(data).length === 0) return
  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}menu/items/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("Item edited successfully")
      await gatherMenu()
      closeModal("itemCreateModal")
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}

const createItem = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("create-item-btn")
  const data = gatherItemData()
  if (Object.keys(data).length === 0) return

  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}menu/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("Item created")
      await gatherMenu()
      closeModal("itemCreateModal")
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}
