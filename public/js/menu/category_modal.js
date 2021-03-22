const categoryLoader = document.getElementById("category-loader")
//Elements
const categoryTitle = document.getElementById("category-title")
const categoryDescription = document.getElementById("category-description")
const categoryBelongsTo = document.getElementById("category-belongsto")
const categoryListOrder = document.getElementById("category-order")
const categoryIsActive = document.getElementById("category-isactive")
const categoryId = document.getElementById("category-id")

const InitializeEditCategory = async params => {
  const { belongsTo, description, icon, id, isActive, listOrder, name } = params
  categoryTitle.value = name
  categoryDescription.value = description
  categoryId.value = id
  await populateSelect()
  categoryBelongsTo.value = belongsTo
  categoryListOrder.value = listOrder

  updateCategoryModal('edit')
}

const populateSelect = async () => {
  //Load categories
  categoryLoader.innerHTML = smallSpinner(40) // Create small spinner
  const req = await fetch(`${baseURL}menu/categories/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("authToken")
    }
  })
  let categoryList = await req.json();

  //Populate Select
  removeOptionsFromSelect(categoryBelongsTo)
  addOptionToSelect(categoryBelongsTo, 'None', "") // Default
  for (let i = 0; i < categoryList.length; i++) {
    if (categoryId.value !== categoryList[i].id) //Prevent a category to be their own children
      addOptionToSelect(categoryBelongsTo, categoryList[i].name, categoryList[i].id)
  }
  categoryLoader.innerHTML = ""
}


const InitializeCreateCategory = async () => {
  //Reset form
  categoryTitle.value = ''
  categoryDescription.value = ''
  categoryBelongsTo.value = ''
  categoryId.value = ''
  categoryListOrder.value = ''
  uncheckAllRadios('category-icon')
  await populateSelect()
  updateCategoryModal('create')
}

const updateCategoryModal = action => {
  categoryTitle.focus()
  const titleCase = action[0].toUpperCase() + action.slice(1)
  document.getElementById('category-modal-title').innerText = `${titleCase} category`
  const footer = document.getElementById('category-modal-footer')
  footer.innerHTML = ""
  const btn = document.createElement('button')
  btn.classList.add('button', 'is-success')
  btn.setAttribute('id', `${action}-category-btn`)
  if (action === 'create') btn.onclick = () => createCategory(event)
  if (action === 'edit') btn.onclick = () => editCategory(event)
  btn.innerText = `${titleCase} category`
  footer.append(btn)
}

const gatherCategoryData = () => {
  const categoryListLength = document.getElementById("categories-container").childNodes.length
  //Get icon
  const data = {
    icon: "", // TODO implement icons with font
    name: categoryTitle.value,
    description: categoryDescription.value,
    isActive: categoryIsActive.value === '' ? 1 : categoryIsActive.value, //Default active
    belongsTo: categoryBelongsTo.value,
    listOrder: categoryListOrder.value === '' ? categoryListLength + 1 : categoryListOrder.value
  }
  // Get checked
  data.icon = getCheckedRadioValue('category-icon')
  // Validation
  if (data.name === "") {
    alert("You must enter a title")
    return {}
  }
  if (data.name.length >= 30) {
    alert("Title can't be longer than 30 characters")
    return {}
  }
  return categoryId.value === '' ? data : { ...data, id: categoryId.value };
}

const editCategory = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("edit-category-btn")
  const data = gatherCategoryData()
  if (Object.keys(data).length === 0) return
  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}menu/categories/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("Category edited successfully")
      await gatherMenu()
      closeModal("catCreateModal")
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}



const createCategory = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("create-category-btn")
  const data = gatherCategoryData()
  if (Object.keys(data).length === 0) return

  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}menu/categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("Category created")
      await gatherMenu()
      closeModal("catCreateModal")
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}
