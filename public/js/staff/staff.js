//Elements
const userName = document.getElementById("user-name")
const userFullName = document.getElementById("user-fullName")
const userTitle = document.getElementById("user-title")
const userIsInactive = document.getElementById("user-isInactive")
const userPass1 = document.getElementById("user-pass2")
const userPass2 = document.getElementById("user-pass1")
const userId = document.getElementById("user-id")

const InitializeCreateUser = async () => {
  //Reset form
  userName.value = ''
  userFullName.value = ''
  userTitle.value = ''
  userIsInactive.selectedIndex = 0
  userPass1.value = ''
  userPass2.value = ''
  userId.value = ''
  updateUserModal('create')
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

const InitializeEditUser = async params => {
  updateUserModal('edit')
}

const updateUserModal = action => {
  userName.focus()
  const titleCase = action[0].toUpperCase() + action.slice(1)
  document.getElementById('user-modal-title').innerText = `${titleCase} user`
  const footer = document.getElementById('user-modal-footer')
  footer.innerHTML = ""
  const btn = document.createElement('button')
  btn.classList.add('button', 'is-success')
  btn.setAttribute('id', `${action}-user-btn`)
  if (action === 'create') btn.onclick = () => createUser(event)
  if (action === 'edit') btn.onclick = () => editUser(event)
  btn.innerText = `${titleCase} user`
  footer.append(btn)
}

const gatherUserData = () => {
  const data = {
    username: userName.value,
    fullName: userFullName.value,
    title: userTitle.value,
    isInactive: userIsInactive.selectedIndex,
    password: userPass1.value,
    }
  // Validation
  if (data.username === "") {
    alert("You must enter a username")
    return {}
  }
  if (data.fullName === "") {
    alert("You must enter your name")
    return {}
  }
  if (userPass1.value !== userPass2.value) {
    alert("Passwords don't match")
    return {}
  }
  return userId.value === '' ? data : { ...data, id: userId.value };
}

const editUser = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("edit-user-btn")
  const data = gatherUserData()
  if (Object.keys(data).length === 0) return
  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("User edited successfully")
      await gatherMenu()
      closeModal("userCreateModal")
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}

const createUser = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("create-user-btn")
  const data = gatherUserData()
  if (Object.keys(data).length === 0) return

  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    let response = await req.json();
    if (req.status === 200) {
      alert("User created")
      location.reload()
      //closeModal("userCreateModal")
    } else {
      alert(response.message)
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(response.message)
  }
}

const deleteRecord = async (id,name) => {
  if (confirm(`Are you sure you want to delete ${name}? This cannot be undone`)) {
    const payload = {
      id: id
    }

    const req = await fetch(`${baseURL}user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(payload)
    })

    let response = await req.json()
    if (req.status === 200) {
      alert(`${name} deleted successfully`)
      location.reload()
    } else {
      alert(response.message)
    }
  }
}
