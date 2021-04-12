const baseURL = "/api/"
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

const smallSpinner = size => `<img src="/assets/spinner.svg" width="${size}px" height="${size}px" />`

const StartLoading = element => {
    element.classList.add("is-loading")
    element.setAttribute('disabled', 'disabled')
}

const StopLoading = element => {
    element.classList.remove("is-loading")
    element.removeAttribute('disabled')
}

const createNotification = (type, id, content) => `<div id="${id}" class="notification is-${type}">
<button class="delete" onclick="removeElement('${id}')"></button>${content}</div>`

const removeElement = id => {
    document.getElementById(id).innerHTML = ""
    document.getElementById(id).remove()
}

const openModal = (modalId, cb,params) => {
    document.getElementById(modalId).classList.add('is-active')
    if(cb && params) cb(params)
    else if(cb && !params) cb()
}

const closeModal = modalId => {
    document.getElementById(modalId).classList.remove('is-active')
}

const addOptionToSelect = (element, text, value) => {
    const opt = document.createElement('option');
    opt.appendChild(document.createTextNode(text));
    opt.value = value
    element.appendChild(opt)
}

const removeOptionsFromSelect = element => {
    var i, L = element.options.length - 1;
    for (i = L; i >= 0; i--) {
        element.remove(i);
    }
}

const getCheckedRadioValue = name => {
    const element = document.getElementsByName(name)
    for (let i = 0, length = element.length; i < length; i++) {
        if (element[i].checked) {
            return element[i].value
        }
    }
    return "" //Default
}

const uncheckAllRadios = name => {
    const element = document.getElementsByName(name);
    for (let i = 0; i < element.length; i++)
        element[i].checked = false
}

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

const setSelectedValue = (selectObj, valueToSet) =>{
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].value == valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
  }

  const changeModalContent = (title, body) =>{
    document.getElementById('modal-message-title').innerHTML = title
    document.getElementById('modal-message-body').innerText = body
  }


const createValidationError = (element, error) => {
    const id = element.getAttribute('id')
    if (document.getElementById(`${id}-error`) === null) {
      element.classList.add('input-error')
      const errorItem = document.createElement('small')
      errorItem.classList.add('form-error')
      errorItem.innerText = error
      errorItem.setAttribute('id', `${id}-error`)
      element.parentElement.append(errorItem)
    }
  }

  const checkIfEmpty = (element, error) => {
    if (element.value.length === 0) {
      createValidationError(element, error)
      return true
    } else {
      removeValidationError(element)
      return false
    }
  }

  const checkIfNotEmail = element=> {
    if (emailRegex.test(element.value)) {
      removeValidationError(element)
      return false
    } else {
      createValidationError(element, 'Bitte geben Sie eine gültige Email-Adresse an')
      return true
    }
  }

  const checkIfNotPhone = element=> {
    if (phoneRegex.test(element.value)) {
      removeValidationError(element)
      return false
    } else {
      createValidationError(element, 'Bitte geben Sie eine gültige Telefonnummer an')
      return true
    }
  }

  const removeValidationError = element => {
    const id = element.getAttribute('id')
    element.classList.remove('input-error')
    if (document.getElementById(`${id}-error`)) {
      document.getElementById(`${id}-error`).remove()
    }
  }