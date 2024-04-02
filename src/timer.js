const timerText_el = document.getElementById('timerText');
const toggleTimerButton_el = document.getElementById('toggleTimerButton');

let timerActive;
let logStartTime;
let logStopTime;

toggleTimerButton_el.addEventListener('click', () => {
    const result = timerErrorHandling();
    if (result){
        toggleTimerButton_el.textContent = timerActive ? 'Start' : 'Stop';
        timerHandler(timerActive);    
    } else {
        return;
    }
});

function timerErrorHandling() {
    let isValid = true;
    const elements = [topicSelect_el, projectInput_el];
    elements.forEach(element => {
        if (element.value === '') {
            isValid = false;
            errorHandling(element);
        }
    });
    return isValid;
}

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
    toggleInputsDiv();
    api.toggleClockActive();
}

async function stopTimer(){
    hideSubjectBackButton();
    logStopTime = Date.now();
    timerActive = false;
    const logTime = logStopTime - logStartTime;
    console.log(logTime);

    await splitAndLogTime(logStartTime, logStopTime);

    clearInterval(timerInterval);
    await populateQuickTimes();
    await getAllActiveProjects();
    await populateTopicView();
    toggleInputsDiv();
    await populate30DayGraph('All');
    await populateAnnualGraph('All');
    await populateWeeklyCompareGraph('All');
    await progressBar();
    api.toggleClockActive();
}

async function splitAndLogTime(startTime, stopTime) {
    if (stopTime - startTime < 24 * 60 * 60 * 1000) {
        const logDuration = stopTime - startTime;
        const formatLogTime = formatTime(logDuration);
        await logTimeHandler(formatLogTime);
        return;
    }

    const startOfDay = new Date(startTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const durationUntilEndOfDay = endOfDay.getTime() - startTime;

    const formatLogTime = formatTime(durationUntilEndOfDay);
    await logTimeHandler(formatLogTime);

    const nextDayStartTime = endOfDay.getTime() + 1;
    await splitAndLogTime(nextDayStartTime, stopTime);
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

async function logTimeHandler(time){
    const words = projectInput_el.value.toLowerCase().split(' ');
    const formattedWords = words.map(word => capitalizeFirstLetter(word));
    const formattedName = formattedWords.join(' ');

    const result = await api.logTimeHandler({topicID: topicSelect_el.value, subtopicID: subtopicSelect_el.value, project: formattedName, time});
    await getAllActiveTopics();
    await getAllActiveSubtopics();
    await populateSubtopicSelect(topicSelect_el.value);
}