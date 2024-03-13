const annualHoursGraph_el = document.getElementById('annualHoursGraph');
const ctxAnnualHours = annualHoursGraph_el.getContext('2d');
let annualHoursGraph; // Variable to store the chart instance

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getMonths() {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Date(2023, i, 1).toLocaleString('en-us', { month: 'long' }));
  }
  return months;
}

function createAnnualHoursGraph() {
  return new Chart(ctxAnnualHours, {
    type: 'bar',
    data: {
      labels: getMonths(),
      datasets: [{
        data: Array.from({ length: 12 }, () => getRandomNumber(30, 150)),
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false, // Allow canvas to adjust size
      responsive: true, // Allow canvas to be responsive
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Annual Hours',
        },
      },
      scales: {
        y: {
          grid: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
            display: true,
            fontColor: '#1976D2',
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
            fontColor: '#1976D2',
          },
        },
      },
    },
  });
}

// Initial setup
annualHoursGraph = createAnnualHoursGraph();
