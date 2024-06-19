const annualHoursGraph_el = document.getElementById('annualHoursGraph');
const ctxAnnualHours = annualHoursGraph_el.getContext('2d');


let annualHoursGraph; // Variable to store the chart instance
let annualValues = [];
let currentMonthFormatted;

function getMonths() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const months = [];

  currentMonthFormatted = currentDate.toLocaleString('en-us', { month: 'long' }); // Assign formatted current month name

  months.push(currentMonthFormatted);

  for (let i = 1; i <= 11; i++) {
    const month = currentMonth - i >= 0 ? currentMonth - i : 12 + (currentMonth - i);
    const year = currentMonth - i >= 0 ? currentYear : currentYear - 1;
    months.push(new Date(year, month, 1).toLocaleString('en-us', { month: 'long' }));
  }

  return months;
}

function createAnnualHoursGraph() {
  const reversedValues = annualValues.slice().reverse();
  const monthLabels = getMonths();
  return new Chart(ctxAnnualHours, {
    type: 'bar',
    data: {
      labels: monthLabels,
      datasets: [{
        data: reversedValues,
        backgroundColor: monthLabels.map(date => (date === currentMonthFormatted) ? '#FFFFFF' : '#1976D2'),
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
          color: '#5E9FDF',
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
            color: '#5E9FDF',
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    },
  });
}

// Initial setup
document.addEventListener('DOMContentLoaded', async () => {
  await populateAnnualGraph('All');
});

async function getAnnualGraphData(scope, id){
  let values;
  if (scope === 'All'){
    values = await api.graphAnnualHandler({request: 'GetAnnual'});
  } else if (scope === 'Topic'){
    values = await api.graphAnnualHandler({request: 'GetTopicAnnual', id});
  } else if (scope === 'Subtopic'){
    values = await api.graphAnnualHandler({request: 'GetSubtopicAnnual', id});
  }

  const monthLabels = getLast12Months();

  for (const month of monthLabels) {
    const monthValues = values.filter(entry => {
      const entryDate = entry.date.split(' ')[0].slice(0, 7);
      return entryDate === month;
    });
    const monthTotal = await calculateTotalTime(monthValues);
    annualValues.push(monthTotal);
  }
}
function getLast12Months() {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const year = month.getFullYear();
    const monthString = (month.getMonth() + 1).toString().padStart(2, '0');
    months.push(`${year}-${monthString}`);
  }

  return months.reverse();
}

async function populateAnnualGraph(scope, id){
  if (annualHoursGraph){
    annualHoursGraph.destroy();
  }
  await getAnnualGraphData(scope, id);
  annualHoursGraph = createAnnualHoursGraph();
}