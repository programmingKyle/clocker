const annualHoursGraph_el = document.getElementById('annualHoursGraph');
const ctxAnnualHours = annualHoursGraph_el.getContext('2d');


let annualHoursGraph; // Variable to store the chart instance
let annualValues = [];

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
        data: annualValues,
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
document.addEventListener('DOMContentLoaded', async () => {
  annualValues = await getAnnualGraphData('All');
  annualHoursGraph = createAnnualHoursGraph();
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
  console.log(values);
  const totalHours = values.map(element => element.total);  
  return totalHours;
}

async function populateAnnualGraph(scope, id){
  if (annualHoursGraph){
    annualHoursGraph.destroy();
  }
  await getAnnualGraphData(scope, id);
  annualHoursGraph = createAnnualHoursGraph();
}