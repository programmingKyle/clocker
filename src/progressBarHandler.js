async function progressBar(){
    const progressBar_el = document.getElementById('progressBar');
    const progressBarText_el = document.getElementById('progressBarText');

    const interval = optionsValues.progressBarSettings.interval;
    const hour = parseInt(optionsValues.progressBarSettings.hour);
    const minute = parseInt(optionsValues.progressBarSettings.minute);
    
    const total = await api.progressBarHandler({interval});
    const hoursToMinutes = hour * 60;
    const totalMinutes = hoursToMinutes + minute;
    const goalHours = parseFloat(totalMinutes / 60).toFixed(1);
    
    const goalPercentage = parseFloat(total / goalHours).toFixed(2) * 100;
    console.log(goalPercentage);

    progressBarText_el.textContent = `${goalPercentage}%`;
    progressBar_el.style.width = goalPercentage > 100 ? `100%` : `${goalPercentage}%`;
}