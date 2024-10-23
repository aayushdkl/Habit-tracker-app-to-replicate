document.addEventListener("DOMContentLoaded", function () {
  const habitList = document.getElementById("habits")
  const habitInput = document.getElementById("habit-name")
  const addHabitBtn = document.getElementById("add-habit-btn")

  let habits = []
  let habitData = {}

  addHabitBtn.addEventListener("click", addHabit)

  function addHabit() {
    const habitName = habitInput.value.trim()
    if (habitName === "") return

    habits.push(habitName)
    habitData[habitName] = Array(7).fill(false) // Initialize 7-day streak as false
    habitInput.value = "" // Clear input

    renderHabits()
    updateChart()
  }

  function toggleHabitStatus(habitName, dayIndex) {
    habitData[habitName][dayIndex] = !habitData[habitName][dayIndex]
    renderHabits()
    updateChart()
  }

  function renderHabits() {
    habitList.innerHTML = ""
    habits.forEach((habit) => {
      const li = document.createElement("li")
      li.innerHTML = `
          ${habit}
          <div class="habit-days">
            ${habitData[habit]
              .map(
                (done, i) =>
                  `<button class="day-btn ${
                    done ? "completed" : ""
                  }" onclick="toggleHabit('${habit}', ${i})">${i + 1}</button>`
              )
              .join("")}
          </div>
        `
      habitList.appendChild(li)
    })
  }

  window.toggleHabit = toggleHabitStatus

  // Chart.js for habit tracking
  const ctx = document.getElementById("habit-chart").getContext("2d")
  let chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: habits,
      datasets: [
        {
          label: "Completed Days",
          data: [],
          backgroundColor: "#007bff",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 7,
        },
      },
    },
  })

  function updateChart() {
    chart.data.labels = habits
    chart.data.datasets[0].data = habits.map(
      (habit) => habitData[habit].filter(Boolean).length
    )
    chart.update()
  }
})
