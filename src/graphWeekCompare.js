const topicHoursGraph_el = document.getElementById('topicHoursGraph');
const ctxTopicHours = topicHoursGraph_el.getContext('2d');

let weekCompareGraph;

let currentWeekDays = [];
let currentWeekHours = [];
let previousWeekHours = [];

function createWeekCompare() {
  return new Chart(ctxTopicHours, {
    type: 'line',
    data: {
      labels: currentWeekDays,
      datasets: [{
        label: 'Previous Week',
        data: previousWeekHours.reverse(),
        borderColor: 'rgba(169, 169, 169, 0.1)',
        backgroundColor: 'rgba(255, 99, 132, 0)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Current Week',
        data: currentWeekHours.reverse(),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0)',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Weekly Hours Comparison',
          color: '#5E9FDF',
        },
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          display: true,
          ticks: {
            stepSize: 1,
            font: {
              size: 12
            },
            color: '#5E9FDF',
          }
        },
        x: {
          display: false
        }
      }
    }
  });
}

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
  await calculateWeeklyCompare(values);
}

async function calculateWeeklyCompare(values) {
  const last14Days = await getPreviousDays(13);
  dayNumber = 0;
  for (const day of last14Days) {
    dayNumber++;
    const dayValues = values.filter(entry => {
      const entryDate = entry.date.split(' ')[0];
      return entryDate === day;
    });

    const dayTotal = await calculateTotalTime(dayValues);

    if (dayNumber > 7){
      currentWeekHours.push(dayTotal);
    } else {
      previousWeekHours.push(dayTotal);
    }
  }
}
async function getPreviousDays(dayCount) {
  const labels = [];
  const today = new Date();
  for (let i = dayCount; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const year = date.getFullYear(); 
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    labels.push(formattedDate);
  }
  return labels;
}

async function populateWeeklyCompareGraph(scope, id){
  if (weekCompareGraph){
    weekCompareGraph.destroy();
  }
  await getCompareData(scope, id);
  weekCompareGraph = createWeekCompare();
}