const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const loadSettings = () => {
  const loadedSettings = JSON.parse(document.getElementById('decoy-values').innerText)

  document.getElementById('booking-holidays').value = loadedSettings.holidays
  //Selects
  for (let i = 0; i <= 6; i++) {
    const select = document.getElementById(`open-time-day-${i}`)
    const select2 = document.getElementById(`close-time-day-${i}`)
    setSelectedValue(select, loadedSettings.hours[i][0])
    setSelectedValue(select2, loadedSettings.hours[i][1])
  }
  setSelectedValue(document.getElementById('booking-enabled'), loadedSettings.enabled)
}

const updateSelects = () => {
  for (let i = 0; i <= 6; i++) {
    const select = document.getElementById(`open-time-day-${i}`)
    const select2 = document.getElementById(`close-time-day-${i}`)
    createOptions(select)
    createOptions(select2)
  }
}

const createOptions = select => {
  for (let index = 0; index < 24; index += 1) {
    let value = index.toString().length < 2 ? `0${index}` : index;
    //1
    const opt = document.createElement("option")
    opt.value = `${value}00`
    opt.innerText = `${value}:00 hr`
    //Half
    const opt2 = document.createElement("option")
    opt2.value = `${value}50`
    opt2.innerText = `${value}:30 hr`

    select.append(opt)
    select.append(opt2)
  }
}


const dateChecker = value => {
  if (value === '') return false

  const dates = value.split(';')
  let notValid = false

  for (let date of dates) {
    const parsedDate = Date.parse(`${date.split('-')[1]}/${date.split('-')[0]}/2021`)
    if (isNaN(parsedDate)) {
      alert('Please input a valid date')
      notValid = true
      break
    }
  }
  return notValid
}

const checkSelectHours = (open, close, day) => {
  if (Number(open) > Number(close)) {
    alert(`On ${days[day]}: Opening hour can't be after closing hour.`)
    return true
  }

  if (Number(open) === Number(close)) {
    alert(`On ${days[day]}: Opening hour and closing can't be at the same time`)
    return true
  }
}


const gatherSettingsData = () => {
  // Holidays
  const dates = document.getElementById('booking-holidays').value
  const checkDates = dateChecker(dates)
  // Hours
  let checkHours = true
  let hours = []
  for (let i = 0; i <= 6; i++) {
    const select = document.getElementById(`open-time-day-${i}`)
    const select2 = document.getElementById(`close-time-day-${i}`)
    checkHours = checkSelectHours(select.value, select2.value, i)
    if (checkHours) { break }
    let dayHours = [select.value, select2.value]
    hours.push(dayHours)
  }

  const data = {
    hours,
    holidays: dates,
    enabled: document.getElementById('booking-enabled').value
  }

  if (checkHours || checkDates) return {}
  return data
}

const updateSettings = async (event) => {
  event.preventDefault()
  const btn = document.getElementById("button-submit-settings")
  const data = gatherSettingsData()
  if (Object.keys(data).length === 0) return
  try {
    StartLoading(btn)
    const req = await fetch(`${baseURL}bookings/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("authToken")
      },
      body: JSON.stringify({ value: JSON.stringify(data) })
    })
    StopLoading(btn)
    if (req.status === 200) {
      alert("Settings updated successfully")
    } else {
      alert("Server Error")
    }
  } catch (error) {
    StopLoading(btn)
    console.error(error)
    alert(error)
  }
}
