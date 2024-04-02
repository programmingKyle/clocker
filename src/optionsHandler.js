const optionsButton_el = document.getElementById('optionsButton');

let optionsValues;

optionsButton_el.addEventListener('click', () => {
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '#optionsContainer', optionsListeners);
});

async function optionsListeners(){
    optionsValues = await api.optionsHandler({request: 'View'});

    const optionsCloseButton_el = document.getElementById('optionsCloseButton');
    const progressBarSelect_el = document.getElementById('progressBarSelect');
    const progressBarHour_el = document.getElementById('progressBarHour');
    const progressBarMinute_el = document.getElementById('progressBarMinute');
    const saveOptionsButton_el = document.getElementById('saveOptionsButton');
    const progressbarIsEnabled_el = document.getElementById('progressbarIsEnabled');
    const progressBarInputsDiv_el = document.getElementById('progressBarInputsDiv');
    
    progressbarIsEnabled_el.checked = optionsValues.progressBarSettings.isEnabled;
    progressBarSelect_el.value = optionsValues.progressBarSettings.interval;
    progressBarHour_el.value = optionsValues.progressBarSettings.hour;
    progressBarMinute_el.value = optionsValues.progressBarSettings.minute;

    toggleProgressBarOptions(progressbarIsEnabled_el, progressBarInputsDiv_el)

    const required = [progressBarHour_el, progressBarMinute_el];

    optionsCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    progressbarIsEnabled_el.addEventListener('click', () => {
        toggleProgressBarOptions(progressbarIsEnabled_el, progressBarInputsDiv_el)
    });

    for (const input of required){
        input.addEventListener('input', () => {
            if (input.value < 0){
                input.value = 0;
            }
        });    
    };

    saveOptionsButton_el.addEventListener('click', async () => {
        for (const input of required){
            if (input.value === ''){
                errorHandling(input);
                return;
            } else if (input.value < 0){
                input.value = 0;
                errorHandling(input);
                return;
            }
        }

        if (progressBarHour_el.value === '0' && progressBarMinute_el.value === '0'){
            errorHandling(progressBarHour_el);
            errorHandling(progressBarMinute_el);
            return;
        }

        const interval = progressBarSelect_el.value;
        const hour = progressBarHour_el.value;
        const minute = progressBarMinute_el.value;
        const isEnabled = progressbarIsEnabled_el.checked;
        await api.optionsHandler({request: 'Save', isEnabled, interval, hour, minute});
        overlayContainer_el.style.display = 'none';
        optionsValues = await api.optionsHandler({request: 'View'});
        await progressBar();
    });
}

function toggleProgressBarOptions(checkbox, div){
    if (checkbox.checked){
        div.style.display = 'grid';
    } else {
        div.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    optionsValues = await api.optionsHandler({request: 'View'});
    await progressBar();
});