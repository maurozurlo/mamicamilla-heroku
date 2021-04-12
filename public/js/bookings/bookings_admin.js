//Elements
const bookingFName = document.getElementById("booking-fname")
const bookingLName = document.getElementById("booking-lname")
const bookingPhone = document.getElementById("booking-phone")
const bookingEmail = document.getElementById("booking-email")
const bookingGuests = document.getElementById("booking-guests")
const bookingDate = document.getElementById("booking-date")
const bookingTime = document.getElementById("booking-time")
const bookingComments = document.getElementById("booking-comments")
const bookingId = document.getElementById("booking-id")

// Decoys
const decoyDate = document.getElementById('decoy-date')
const decoyGuests = document.getElementById('decoy-guests')
const decoyTime = document.getElementById('decoy-time')
const decoyStatus = document.getElementById('booking-status')

const checkDate = (event) => {
  const targetDate = new Date(event.target.value.replace(/-/g, '\/'))
  const today = new Date()
  if (targetDate < today) {
    alert('Please select a date in the future')
    bookingDate.valueAsDate = today
    return
  }
}

const createOptions = () => {
  for (let index = 0; index <= 23; index += 1) {
    let value = index.toString().length < 2 ? `0${index}` : index;
    //Whole
    const opt = document.createElement("option")
    opt.value = `${value}00`
    opt.innerText = `${value}:00 hr`
    //Half
    const opt2 = document.createElement("option")
    opt2.value = `${value}50`
    opt2.innerText = `${value}:30 hr`
    bookingTime.append(opt)
    bookingTime.append(opt2)
  }
}



const gatherBookingData = () => {
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  const data = {
    fname: bookingFName.value,
    lname: bookingLName.value,
    phone: bookingPhone.value,
    email: bookingEmail.value,
    guests: bookingGuests.value,
    date: bookingDate.value,
    time: bookingTime.value,
    comments: bookingComments.value,
  }
  // Validation
  //TODO: Replace alerts with nicer validation
  if (data.fname === "" || data.lname === "") {
    alert("Bitte geben Sie Ihren Namen an")
    return {}
  }
  if (!phoneRegex.test(data.phone)) {
    alert("Bitte geben Sie eine gültige Telefonnummer an")
    return {}
  }

  if (!emailRegex.test(data.email)) {
    alert("Bitte geben Sie eine gültige Email-Adresse an")
    return {}
  }

  return bookingId.value === '' ? data : { ...data, id: bookingId.value };
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
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify(data)
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("Booking added")
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}

let value = false

const cancelBooking = async (event) =>{
  event.preventDefault()
  if(confirm(`Are you sure you want to cancel this booking? \n This will send an automatic email to the person who made the reservation`)){
    decoyStatus.innerText = 1
  }
  updateBooking(event,'true')
}

const reactivateBooking = async(event) =>{
  event.preventDefault()
  if(confirm(`Are you sure you want to reactivate this booking? \n This will send an automatic email to the person who made the reservation`)){
    decoyStatus.innerText = 0
  }
  updateBooking(event,'true')
}

const updateBooking = async (event,sendEmail) => {
  event.preventDefault()
  const btn = document.getElementById("booking-submit")
  const data = gatherBookingData()
  if (Object.keys(data).length === 0) return
  const update = {
    id: document.getElementById('booking-id').value,
    isRecurring: document.getElementById('booking-is-recurring').value === 'Yes' ? 1 : 0,
    isCancelled: decoyStatus.innerText,
    ...data
  }

  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}bookings/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken"),
        'x-send-email': sendEmail || 'false'
      },
      body: JSON.stringify(update)
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("Booking updated")
      refreshWarnings()
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}

const refreshWarnings = () =>{
  if(decoyStatus.innerText === '1'){
    document.getElementById('cancelled-booking').style.display = 'block'
    document.getElementById('booking-reactivate').style.display = 'block'
    document.getElementById('booking-cancel').style.display = 'none'
  }else{
    document.getElementById('cancelled-booking').style.display = 'none'
    document.getElementById('booking-reactivate').style.display = 'none'
    document.getElementById('booking-cancel').style.display = 'block'
  }
}

createOptions()
bookingDate.value = new Date().toISOString().split('T')[0]

const updateFromDecoys = () =>{
  if(decoyTime.innerText !== '') setSelectedValue(bookingTime,decoyTime.innerText)
  if(decoyGuests.innerText !== '') setSelectedValue(bookingGuests,decoyGuests.innerText)
  if(decoyDate.innerText !== '') {
    const parseDate = new Date(decoyDate.innerText).toISOString().split('T')[0]
    bookingDate.value = parseDate
  }
  refreshWarnings()
}
