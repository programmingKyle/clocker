const overlayContainer_el = document.getElementById('overlayContainer');

document.addEventListener('DOMContentLoaded', () => {
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '.stop-container');
});

autoUpdater.autoUpdaterCallback((status) => {
    console.log(status);
    if (status === 'Update Available'){
        overlayContainer_el.style.display = 'flex';
    }
    if (status === 'Update Downloaded'){
        updateControlDiv_el.style.display = 'grid';
    }
});

function autoUpdaterListeners(){
    startUpdateButton_el = document.getElementById('startUpdateButton');
    quitUpdateButton_el = document.getElementById('quitUpdateButton');
    updateControlDiv_el = document.getElementById('updateControlDiv');
    updateControlDiv_el.style.display = 'grid';

    startUpdateButton_el.addEventListener('click', () => {
        autoUpdater.restartAndUpdate();
    });
    
    quitUpdateButton_el.addEventListener('click', () => {
        autoUpdater.closeApp();
    });
}