const timerText_el = document.getElementById('timerText');
const toggleTimerButton_el = document.getElementById('toggleTimerButton');

let logStartTime;
let logStopTime;

toggleTimerButton_el.addEventListener('click', () => {
    logStartTime = Date.now();
    timerInterval = setInterval(updateTimer, 10);
});

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