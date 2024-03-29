const topicHoursGraph_el = document.getElementById('topicHoursGraph');
const ctxTopicHours = topicHoursGraph_el.getContext('2d');

let weekCompareGraph;

let currentWeekDays = [];
let currentWeekHours;
let previousWeekHours;

function createWeekCompare() {
  return new Chart(ctxTopicHours, {
    type: 'line',
    data: {
      labels: currentWeekDays,
      datasets: [{
        label: 'Previous Week',
        data: previousWeekHours,
        borderColor: 'rgba(169, 169, 169, 0.1)',
        backgroundColor: 'rgba(255, 99, 132, 0)',
        borderWidth: 2,
        fill: false // No fill under the line
      },
      {
        label: 'Current Week',
        data: currentWeekHours,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0)',
        borderWidth: 2,
        fill: false // No fill under the line
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Weekly Hours Comparison',
        },
        legend: {
          display: false // Hide legend
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          display: true, // Display y-axis
          ticks: {
            stepSize: 1, // Step size for y-axis ticks
            font: {
              size: 12 // Adjust font size for y-axis ticks
            }
          }
        },
        x: {
          display: false // Hide x-axis
        }
      }
    }
  });
}

// Initial setup
document.addEventListener('DOMContentLoaded', async () => {
  await getDaysOfWeek();
  await populateWeeklyCompareGraph('All');
});

async function getDaysOfWeek(){
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const previousDay = new Date(today);
    previousDay.setDate(today.getDate() - i);
    let previousDayName;
    if (i === 0){
      previousDayName = 'Current';
    } else {
      previousDayName = daysOfWeek[previousDay.getDay()];
    }
    currentWeekDays.push(previousDayName);
  }
}

async function getCompareData(scope, id){
  let values;
  if (scope === 'All'){
    values = await api.graphCompareHandler({request: 'All'});
  } else if (scope === 'Topic'){
    values = await api.graphCompareHandler({request: 'Topic', id});
  } else if (scope === 'Subtopic'){
    values = await api.graphCompareHandler({request: 'Subtopic', id});
  }
  currentWeekHours = values.thisWeek.map(item => item.time);
  previousWeekHours = values.lastWeek.map(item => item.time);
}

async function populateWeeklyCompareGraph(scope, id){
  if (weekCompareGraph){
    weekCompareGraph.destroy();
  }
  await getCompareData(scope, id);
  weekCompareGraph = createWeekCompare();
}