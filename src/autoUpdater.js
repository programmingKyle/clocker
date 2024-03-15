const overlayContainer_el = document.getElementById('overlayContainer');
let updateControlDiv_el;

document.addEventListener('DOMContentLoaded', () => {
    loadOverlayContent('overlays.html', '.stop-container');
});

autoUpdater.autoUpdaterCallback((status) => {
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

    startUpdateButton_el.addEventListener('click', () => {
        autoUpdater.restartAndUpdate();
    });
    
    quitUpdateButton_el.addEventListener('click', () => {
        autoUpdater.closeApp();
    });
}