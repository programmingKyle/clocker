// This is used for displaying information such as Total Time, Monthly Time, etc
const totalTimeText_el = document.getElementById('totalTimeText');
const totalMonthlyText_el = document.getElementById('totalMonthlyText');
const totalWeeklyText_el = document.getElementById('totalWeeklyText');
const totalTodayText_el = document.getElementById('totalTodayText');

let allClockEntries;

document.addEventListener('DOMContentLoaded', async () => {
    allClockEntries = await getAllClockEntries();
    const totalTime = await calculateTotalTime();
    totalTimeText_el.textContent = totalTime;
});

async function getAllClockEntries(){
    const result = await api.quickTimesHandler({request: 'Total'});
    return result;
}

async function calculateTotalTime() {
    let totalTime = 0;

    allClockEntries.forEach(element => {
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