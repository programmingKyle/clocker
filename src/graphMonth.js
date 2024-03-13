const monthHoursGraph_el = document.getElementById('monthHoursGraph');
const ctx = monthHoursGraph_el.getContext('2d');
let monthHours; // Variable to store the chart instance

function getRandomNumber(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function getLast30Days() {
  const labels = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    labels.push(formattedTime);
  }

  return labels;
}

function createChart() {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getLast30Days(),
      datasets: [{
        data: Array.from({ length: 30 }, () => getRandomNumber(0.5, 8)),
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
        title:{
          display: true,
          text: 'Past 30 Days',
        }
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
monthHours = createChart();

window.addEventListener('resize', () => {
  // Destroy the existing chart instances for all canvases
  if (topicHoursGraph) {
    topicHoursGraph.destroy();
  }
  if (annualHoursGraph) {
    annualHoursGraph.destroy();
  }
  if (monthHours) {
    monthHours.destroy();
  }

  // Recreate the chart instances for all canvases with updated dimensions
  topicHoursGraph = createTopicHoursGraph();
  annualHoursGraph = createAnnualHoursGraph();
  monthHours = createChart();
});