// This is used for displaying information such as Total Time, Monthly Time, etc
const totalTimeText_el = document.getElementById('totalTimeText');
const totalMonthlyText_el = document.getElementById('totalMonthlyText');
const totalWeeklyText_el = document.getElementById('totalWeeklyText');
const totalTodayText_el = document.getElementById('totalTodayText');

document.addEventListener('DOMContentLoaded', async () => {
    populateQuickTimes();
});

async function populateQuickTimes(){
    totalTimeText_el.textContent = await api.quickTimesHandler({request: 'Total'});
    totalMonthlyText_el.textContent = await api.quickTimesHandler({request: 'Specific', timeFrame: 30});
}
