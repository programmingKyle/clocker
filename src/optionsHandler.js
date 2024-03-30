const optionsButton_el = document.getElementById('optionsButton');

optionsButton_el.addEventListener('click', () => {
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '#optionsContainer', optionsListeners);
});

async function optionsListeners(){
    console.log('Listeners');
    const optionsCloseButton_el = document.getElementById('optionsCloseButton');
    const progressBarSelect_el = document.getElementById('progressBarSelect');
    const progressBarHour_el = document.getElementById('progressBarHour');
    const progressBarMinute_el = document.getElementById('progressBarMinute');
    const saveOptionsButton_el = document.getElementById('saveOptionsButton');

    optionsCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });
}