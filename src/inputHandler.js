// This handles all the drop down menus and start / stop buttons
const topicSelect_el = document.getElementById('topicSelect');
const subtopicSelect_el = document.getElementById('subtopicSelect');
const projectInput_el = document.getElementById('projectInput');

const timerInputsDiv_el = document.getElementById('timerInputsDiv');
const displayInputsDiv_el = document.getElementById('displayInputsDiv');

async function populateTopicSelect(){
    topicSelect_el.innerHTML = '';
    if (activeTopics.length > 0){
        addSubtopicButton_el.style.visibility = 'visible';

        activeTopics.sort((a, b) => {
            return new Date(b.previousTime) - new Date(a.previousTime);
        });

        console.log(activeTopics);

        activeTopics.forEach(element => {
            const topicOption_el = document.createElement('option');
            topicOption_el.textContent = element.topic;
            topicOption_el.value = element.id;
            topicSelect_el.append(topicOption_el);
        });
        await populateSubtopicSelect(topicSelect_el.value);
    } else {
        addSubtopicButton_el.style.visibility = 'hidden';
    }
}

topicSelect_el.addEventListener('change', async () => {
    await populateSubtopicSelect(topicSelect_el.value);
});

async function populateSubtopicSelect(topic){
    subtopicSelect_el.innerHTML = '';

    const blankSubtopicOption_el = document.createElement('option');
    blankSubtopicOption_el.value = null;
    subtopicSelect_el.append(blankSubtopicOption_el);

    activeSubtopics.sort((a, b) => {
        return new Date(b.previousTime) - new Date(a.previousTime);
    });

    console.log(activeSubtopics);

    activeSubtopics.forEach(element => {
        if (parseInt(topic) === parseInt(element.topicID)){
            const subtopicOption_el = document.createElement('option');
            subtopicOption_el.textContent = element.subtopic;
            subtopicOption_el.value = element.id;
            subtopicSelect_el.append(subtopicOption_el);
        }
    });
}

function errorHandling(element){
    element.classList.add('error');
    errorTimeout(element);
}

function errorTimeout(element){
    setTimeout(() => {
        if (element.classList.contains('error')){
            element.classList.remove('error');
        }
    }, 1000);
}

// Used to either toggle the inputs for clocking or displaying the information of
// what is being clocked
function toggleInputsDiv() {
    if (timerInputsDiv_el.style.display !== 'none'){
        populateDisplayInputs();
        timerInputsDiv_el.style.display = 'none';
        displayInputsDiv_el.style.display = 'grid';
    } else {
        timerInputsDiv_el.style.display = 'grid';
        displayInputsDiv_el.style.display = 'none';
    }
}

// Used when hitting the start button it will display the inputs that the user
// has selected
function populateDisplayInputs(){
    const currentTimerTopicText_el = document.getElementById('currentTimerTopicText');
    const currentSubtopicText_el = document.getElementById('currentSubtopicText');
    const currentProjectText_el = document.getElementById('currentProjectText');

    currentTimerTopicText_el.textContent = topicSelect_el.value;
    currentSubtopicText_el.textContent = subtopicSelect_el.value === 'null' ? 'Not Selected' : subtopicSelect_el.value;
    currentProjectText_el.textContent = projectInput_el.value;
}
