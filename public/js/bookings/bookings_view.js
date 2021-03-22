document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    nowIndicator: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    navLinks: true, // can click day/week names to navigate views
    eventSources: [{
      url: `${baseURL}bookings/month`,
      type: 'GET',
      headers: { 'x-access-token': localStorage.getItem("authToken") }
    }],
    eventDisplay: 'block'
  });
  calendar.render();
});
