const optionsButton_el = document.getElementById('optionsButton');

let optionsValues;

optionsButton_el.addEventListener('click', () => {
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '#optionsContainer', optionsListeners);
});

async function optionsListeners(){
    const optionsCloseButton_el = document.getElementById('optionsCloseButton');
    const progressBarSelect_el = document.getElementById('progressBarSelect');
    const progressBarHour_el = document.getElementById('progressBarHour');
    const progressBarMinute_el = document.getElementById('progressBarMinute');
    const saveOptionsButton_el = document.getElementById('saveOptionsButton');

    progressBarSelect_el.value = optionsValues.progressBarSettings.interval;
    progressBarHour_el.value = optionsValues.progressBarSettings.hour;
    progressBarMinute_el.value = optionsValues.progressBarSettings.minute;

    const required = [progressBarHour_el, progressBarMinute_el];

    optionsCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    saveOptionsButton_el.addEventListener('click', async () => {
        for (const input of required){
            if (input.value === ''){
                errorHandling(input);
                return;
            }
        }

        if (progressBarHour_el.value === '0' && progressBarMinute_el.value === '0'){
            console.log('both are 0');
            errorHandling(progressBarHour_el);
            errorHandling(progressBarMinute_el);
            return;
        }

        const interval = progressBarSelect_el.value;
        const hour = progressBarHour_el.value;
        const minute = progressBarMinute_el.value;
        await api.optionsHandler({request: 'Save', interval, hour, minute});
        overlayContainer_el.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    optionsValues = await api.optionsHandler({request: 'View'});
});