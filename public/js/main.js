const bottomNav = document.getElementById('social-container')
const contactName = document.getElementById("contact-name")
const contactEmail = document.getElementById("contact-email")
const contactMessage = document.getElementById("contact-message")
const mainNav = document.getElementById('main-nav')
const burgerBtnIcon = document.getElementById('burger-btn-icon')
let captchaResponse = ''
let navOpen = false

const toggleMainNav = () => {
  if (mainNav.classList.contains('is-inactive')) {
    mainNav.classList.remove('is-inactive')
    burgerBtnIcon.classList.remove('fa-bars')
    burgerBtnIcon.classList.add('fa-times')
    bottomNav.classList.add('invert')
  } else {
    burgerBtnIcon.classList.add('fa-bars')
    burgerBtnIcon.classList.remove('fa-times')
    bottomNav.classList.remove('invert')
    mainNav.classList.add('is-inactive')
  }
}


function correctCaptcha(params) {
  captchaResponse = params
}

const gatherContactData = () => {
  const data = {
    name: contactName.value,
    email: contactEmail.value,
    message: contactMessage.value,
    hcaptcha: captchaResponse
  }
  // Validation
  if (checkIfEmpty(contactName, 'Please enter your name')) return {}
  if (checkIfNotEmail(contactEmail)) return {}
  if (checkIfEmpty(contactMessage, 'Please enter your message')) return {}

  if (captchaResponse === '') {
    alert("Please complete the verification")
    return {}
  }
  return data
}

const sendContact = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("contact-submit")
  const data = gatherContactData()
  if (Object.keys(data).length === 0) return

  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}send-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      changeModalContent('Thank you for <span class="is-camilla-green">your message!</span>',
        'Lorem ipsum dolo')
      openModal('landingModal')
    } else {
      changeModalContent('Something went wrong', "We're very sorry, please try again later")
      openModal('landingModal')
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}


window.onscroll = function() {stickyNav()}
const sticky = bottomNav.offsetTop - window.screen.availHeight

function stickyNav() {
  if(window.pageYOffset >= sticky){
    bottomNav.classList.add("static")
  }else{
    bottomNav.classList.remove("static")
  }
}
