const monthHoursGraph_el = document.getElementById('monthHoursGraph');
const ctx = monthHoursGraph_el.getContext('2d');

let last30Days;
let last30DaysValues = [];
let monthHoursGraph; // Variable to store the chart instance

async function getMonthTimesGraph(){
  const values = await api.graphHandler({request: 'GetMonth'});
  last30Days = await getLast30Days();
  last30Days.forEach(async (day) => {
    // Filter values for current day
    const dayValues = values.filter(entry => {
      const entryDate = entry.date.split(' ')[0];
      if (entryDate === day){
        return entry.time;
      }
    });
    const dayTotal = await calculateTotalTime(dayValues);
    last30DaysValues.push(dayTotal);
  });
}

async function getLast30Days() {
  const labels = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().slice(0, 10); // Get yyyy-mm-dd format
    labels.push(formattedDate);
  }
  return labels;
}

function createChart() {
  // Reverse the order of the labels and values arrays
  const reversedLabels = last30Days.slice().reverse();
  const reversedValues = last30DaysValues.slice().reverse();

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: reversedLabels,
      datasets: [{
        data: reversedValues,
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
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

async function calculateTotalTime(entries) {
  let totalTime = 0;

  entries.forEach(element => {
      const timeComponents = element.time.split(':');

      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);
      const seconds = parseInt(timeComponents[2], 10);
      const milliseconds = parseInt(timeComponents[3], 10);

      totalTime += hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
  });
  totalTime /= 3600000;
  return totalTime.toFixed(1);
}

document.addEventListener('DOMContentLoaded', async () => {
  // Initial setup
  await getMonthTimesGraph({request: 'GetMonth'});
  monthHoursGraph = createChart();
});

window.addEventListener('resize', () => {
  // Destroy the existing chart instances for all canvases
  if (weekCompareGraph) {
    weekCompareGraph.destroy();
  }
  if (annualHoursGraph) {
    annualHoursGraph.destroy();
  }
  if (monthHoursGraph) {
    monthHoursGraph.destroy();
  }

  // Recreate the chart instances for all canvases with updated dimensions
  weekCompareGraph = createWeekCompare();
  annualHoursGraph = createAnnualHoursGraph();
  monthHoursGraph = createChart();
});