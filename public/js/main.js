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
  if (checkIfEmpty(contactName, 'Bitte geben Sie Ihren Namen an')) return {}
  if (checkIfNotEmail(contactEmail)) return {}
  if (checkIfEmpty(contactMessage, 'Bitte geben Sie Ihre Nachricht ein')) return {}

  if (captchaResponse === '') {
    alert("Bitte beenden Sie die Verfizierung via Captcha")
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
      changeModalContent('Vielen Dank für  <span class="is-camilla-green">Ihre Nachricht!</span>',
        'Wir kontaktieren Sie zeitnah per Email')
      openModal('landingModal')
    } else {
      changeModalContent('Entschuldigung, Ihre Nachricht könnte habt gesendet werden', "Bitte versuchen Sie es später noch einmal oder kontaktieren Sie uns per Telefon oder E-Mail. Dankeschön.")
      openModal('landingModal')
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}


window.onscroll = function () { stickyNav() }
const sticky = bottomNav.offsetTop - window.screen.availHeight

function stickyNav() {
  if (window.pageYOffset >= sticky) {
    bottomNav.classList.add("static")
  } else {
    bottomNav.classList.remove("static")
  }
}
