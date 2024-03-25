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
    totalWeeklyText_el.textContent = await api.quickTimesHandler({request: 'Specific', timeFrame: 7});
    totalTodayText_el.textContent = await api.quickTimesHandler({request: 'Specific', timeFrame: 1});
}

// Subject input is used for topics or subtopics
async function populateSpecificQuickTimes(subject, id){
    totalTimeText_el.textContent = await api.specificQuickTimes({request: 'Total', subject, id});
    totalMonthlyText_el.textContent = await api.specificQuickTimes({request: 'Specific', subject, id, timeFrame: 30});
    totalWeeklyText_el.textContent = await api.specificQuickTimes({request: 'Specific', subject, id, timeFrame: 7});
    totalTodayText_el.textContent = await api.specificQuickTimes({request: 'Specific', subject, id, timeFrame: 1});
}