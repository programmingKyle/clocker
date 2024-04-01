async function progressBar(){
    const interval = optionsValues.progressBarSettings.interval;
    //const hour = optionsValues.progressBarSettings.hour;
    //const minute = optionsValues.progressBarSettings.minute;

    const total = await api.progressBarHandler({interval});
    console.log(total);
}