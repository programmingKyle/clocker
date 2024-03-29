const topicHoursGraph_el = document.getElementById('topicHoursGraph');
const ctxTopicHours = topicHoursGraph_el.getContext('2d');

let weekCompareGraph;

function getRandomNumber(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function createWeekCompare() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const previousWeekHours = days.map(() => getRandomNumber(0.5, 8));
  const currentWeekHours = days.map(() => getRandomNumber(0.5, 8));

  return new Chart(ctxTopicHours, {
    type: 'line',
    data: {
      labels: days,
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
  await populateWeeklyCompareGraph('All');
});

async function getCompareData(scope, id){
  let values;
  if (scope === 'All'){
    values = await api.graphCompareHandler({request: 'All'});
  } else if (scope === 'Topic'){
    values = await api.graphCompareHandler({request: 'Topic', id});
  } else if (scope === 'Subtopic'){
    values = await api.graphCompareHandler({request: 'Subtopic', id});
  }
  console.log(values);
  // Need to get current week values and previous week values
  //currentWeekValues = values.map(element => element.total);  
  //return annualValues;
}

async function populateWeeklyCompareGraph(scope, id){
  if (weekCompareGraph){
    weekCompareGraph.destroy();
  }
  await getCompareData(scope, id);
  weekCompareGraph = createWeekCompare();
}