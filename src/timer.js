const timerText_el = document.getElementById('timerText');
const toggleTimerButton_el = document.getElementById('toggleTimerButton');

let timerActive;
let logStartTime;
let logStopTime;


toggleTimerButton_el.addEventListener('click', () => {
    toggleTimerButton_el.textContent = timerActive ? 'Stop' : 'Start';
    timerHandler(timerActive);
});

function timerHandler(isActive){
    if (!isActive){
        timerActive = true;
        logStartTime = Date.now();
        timerInterval = setInterval(updateTimer, 10);    
    } else {
        logStopTime = Date.now();
        timerActive = false;
        const logTime = logStopTime - logStartTime;
        const formatLogTime = formatTime(logTime);
        console.log(formatLogTime);
        clearInterval(timerInterval);
    }
}

function updateTimer(){
    const currentTime = Date.now() - logStartTime;
    timerText_el.textContent = formatTime(currentTime);
}

function formatTime(milliseconds){
    const date = new Date(milliseconds);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const millisecondsPart = Math.floor(date.getUTCMilliseconds() / 10);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${millisecondsPart.toString().padStart(2, '0')}`;
};