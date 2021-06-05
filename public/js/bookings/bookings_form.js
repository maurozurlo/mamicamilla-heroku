//Elements
const bookingFName = document.getElementById("booking-fname")
const bookingLName = document.getElementById("booking-lname")
const bookingPhone = document.getElementById("booking-phone")
const bookingEmail = document.getElementById("booking-email")
const bookingGuests = document.getElementById("booking-guests")
const bookingDate = document.getElementById("booking-date")
const bookingTime = document.getElementById("booking-time")
const bookingComments = document.getElementById("booking-comments")
const availableHours = document.getElementById("hours").innerText
const availableDates = document.getElementById("holidays").innerText

const checkForHolidays = target => {
  const dates = availableDates.split(';')
  let isHoliday = false
  for (let date of dates) {
    const parsedDate = new Date(Date.parse(`${date.split('-')[1]}/${date.split('-')[0]}/2021`))
    const targetDay = target.getUTCDay()
    const parsedDay = parsedDate.getUTCDay()
    const targetMonth = target.getMonth()
    const parsedMonth = parsedDate.getMonth()
    if (targetDay === parsedDay && targetMonth === parsedMonth) {
      isHoliday = true
      break
    }
  }
  return isHoliday
}

const updateTimeAccordingToDay = (date) => {
  bookingTime.innerHTML = ''
  const day = new Date(date).getUTCDay() - 1
  const actualHours = JSON.parse(availableHours).hours
  const hours = actualHours[day < 0 ? 6 : day]
  const startTime = parseStringHour(hours[0])
  const endTime = parseStringHour(hours[1])
  createOptions(bookingTime, startTime, endTime)
}

const parseStringHour = str => {
  return {
    hour: Number(str.slice(0, 2)),
    isHalf: str.slice(2, str.length) === '00' ? false : true
  }
}

const createOptions = (select, start, end) => {
  for (let index = start.hour; index <= end.hour - 1; index += 1) {
    let value = index.toString().length < 2 ? `0${index}` : index;

    //Whole
    const opt = document.createElement("option")
    opt.value = `${value}00`
    opt.innerText = `${value}:00 hr`
    //Half
    const opt2 = document.createElement("option")
    opt2.value = `${value}50`
    opt2.innerText = `${value}:30 hr`

    let shouldNotDrawHour = index === start.hour && start.isHalf
    let shouldNotDrawHalfHour = index === end.hour - 1 && !end.isHalf

    if (!shouldNotDrawHour) {
      select.append(opt)
    }
    if (!shouldNotDrawHalfHour) {
      select.append(opt2)
    }
  }
}

function correctCaptcha(params) {
  captchaResponse = params
}

const resetForm = () => {
  bookingFName.value = ""
  bookingLName.value = ""
  bookingPhone.value = ""
  bookingEmail.value = ""
  bookingComments.value = ""
}
const gatherBookingData = () => {
  const data = {
    fname: bookingFName.value,
    lname: bookingLName.value,
    phone: bookingPhone.value,
    email: bookingEmail.value,
    guests: bookingGuests.value,
    date: bookingDate.value,
    time: bookingTime.value,
    comments: bookingComments.value,
    hcaptcha: captchaResponse
  }
  // Validation
  //Privacy
  if(!document.getElementById('privacy').checked){
    alert('Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben.')
    return {}
  }

  if (checkIfEmpty(bookingFName, 'Bitte geben Sie Ihren Namen an')) return {}
  if (checkIfEmpty(bookingLName, 'Bitte geben Sie Ihren Namen an')) return {}
  if (checkIfNotPhone(bookingPhone)) return {}
  if (checkIfNotEmail(bookingEmail)) return {}

  if (captchaResponse === '') {
    alert("Bitte beenden Sie die Verfizierung via Captcha")
    return {}
  }

  return data
}

const addBooking = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("booking-submit")
  const data = gatherBookingData()
  if (Object.keys(data).length === 0) return

  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      resetForm()
      changeModalContent('Vielen Dank für <span class="is-camilla-green">Ihre Tischreservierung</span>',
        'Wir kontaktieren Sie zeitnah per Email')
      openModal('landingModal')
    } else {
      changeModalContent('Entschuldigung, Ihr Tischreservierung konnte leider nicht gebucht werden.', "Bitte versuchen Sie es später noch einmal oder kontaktieren Sie uns per Telefon oder E-Mail. Dankeschön.")
      openModal('landingModal')
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}

const checkDate = (event) => {
  const target = new Date(event.target.value.replace(/-/g, '\/'))
  const targetDate = new Date(target)
  const today = new Date()

  if (checkForHolidays(targetDate)) {
    alert("Eine Buchung zu diesem Zeitpunkt ist leider nicht möglich. Es tut uns leid")
    setValidDate(today)
    return
  }

  if (targetDate < today) {
    alert('Bitte wählen Sie ein zukünftiges Datum aus')
    setValidDate(today)
    return
  }
  updateTimeAccordingToDay(bookingDate.valueAsDate)
}

const addDays = (date, days) =>{
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const setValidDate = (date) => {
  const startDay = checkForHolidays(date)

  if(startDay){
    setValidDate(addDays(date,1))
  }else{
    bookingDate.valueAsDate = date
    updateTimeAccordingToDay(date)
  }
}

setValidDate(new Date())
