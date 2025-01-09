const toggleButton = document.getElementById('toggleScheduleButton');
const mainScheduleContainer = document.getElementById('main-schedule-container');
const assignScheduleContainer = document.getElementById('assign-schedule-container');

// Add an event listener to toggle the views on button click
toggleButton.addEventListener('click', function () {
  if (mainScheduleContainer.style.display === 'none') {
    // If main-schedule is hidden, show it and hide assign-schedule
    toggleButton.innerText = "Oprett en tidslpan"
    mainScheduleContainer.style.display = 'block';
    assignScheduleContainer.style.display = 'none';
  } else {
    // If main-schedule is visible, hide it and show assign-schedule
    toggleButton.innerText = "Tidslpan"
    mainScheduleContainer.style.display = 'none';
    assignScheduleContainer.style.display = 'block';
  }
})
