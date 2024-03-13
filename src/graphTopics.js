const topicHoursGraph_el = document.getElementById('topicHoursGraph');
const ctxTopicHours = topicHoursGraph_el.getContext('2d');
let topicHoursGraph; // Variable to store the chart instance

function getRandomNumber(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function createTopicHoursGraph() {
  const topics = ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5'];
  const data = topics.map(() => getRandomNumber(10, 50));

  return new Chart(ctxTopicHours, {
    type: 'doughnut',
    data: {
      labels: topics,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      responsive: false,
    },
  });
}

// Initial setup
topicHoursGraph = createTopicHoursGraph();

// Resize event listener
window.addEventListener('resize', () => {
  // Destroy the existing chart instance
  topicHoursGraph.destroy();

  // Recreate the chart with updated dimensions
  topicHoursGraph = createTopicHoursGraph();
});
