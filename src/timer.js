const timerText_el = document.getElementById('timerText');
const toggleTimerButton_el = document.getElementById('toggleTimerButton');

let timerActive;
let logStartTime;
let logStopTime;


toggleTimerButton_el.addEventListener('click', () => {
    toggleTimerButton_el.textContent = timerActive ? 'Start' : 'Stop';
    timerHandler(timerActive);
});

function timerHandler(isActive){
    if (!isActive){
        startTimer();
    } else {
        stopTimer();
    }
}

function startTimer(){
    timerActive = true;
    logStartTime = Date.now();
    timerInterval = setInterval(updateTimer, 10);    
}

function stopTimer(){
    logStopTime = Date.now();
    timerActive = false;
    const logTime = logStopTime - logStartTime;
    const formatLogTime = formatTime(logTime);
    clearInterval(timerInterval);
    logTimeHandler(formatLogTime);
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

function logTimeHandler(time){
    console.log(topicSelect_el.value);
    console.log(subtopicSelect_el.value);
    console.log(projectInput_el.value);
    console.log(time);
}