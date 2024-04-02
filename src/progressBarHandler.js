async function progressBar(){
    const interval = optionsValues.progressBarSettings.interval;
    const hour = parseInt(optionsValues.progressBarSettings.hour);
    const minute = parseInt(optionsValues.progressBarSettings.minute);
    
    const total = await api.progressBarHandler({interval});
    const hoursToMinutes = hour * 60;
    const totalMinutes = hoursToMinutes + minute;
    const goalHours = parseFloat(totalMinutes / 60).toFixed(1);
    
    const goalPercentage = parseFloat(total / goalHours).toFixed(2);
    console.log(goalPercentage);
}