const dayjs = require('dayjs')

const guestString = guests =>{
if(guests === 1) return '1 guest'
if(guests === -1) return '6+ guests'
return `${guests} guests`
}

const toEvents = bookingArray => {
  let response = []
  if (Array.isArray(bookingArray) && bookingArray.length >= 1) {
    //{ // this object will be "parsed" into an Event Object
    // title: 'The Title', // a property!
    // start: '2018-09-01', // a property!
    // end: '2018-09-02' // a property! ** see important note below about 'end' **
    //}
    bookingArray.forEach(event => {
      const time = event.time.toString()
      let date = dayjs(event.date).set('h',time.slice(0,2)).set('m',time.slice(2,time.length))
      response.push({
        ...event,
        title: guestString(event.guests),
        start: dayjs(date).toISOString(),
        end: dayjs(date).add(1.5,'h').toISOString(),
        url: `/admin/bookings/${event.id}`,
        classNames: ['event-camilla',event.isCancelled ? 'event-cancelled': 'event-active']
      })
    })
  }

  return response
}





module.exports = {
  toEvents
}
