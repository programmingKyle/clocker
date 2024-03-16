// This handles all the drop down menus and start / stop buttons
const topicSelect_el = document.getElementById('topicSelect');
const subtopicSelect_el = document.getElementById('subtopicSelect');
const projectInput_el = document.getElementById('projectInput');

async function populateTopicSelect(){
    topicSelect_el.innerHTML = '';
    if (activeTopics.length > 0){
        addSubtopicButton_el.style.visibility = 'visible';
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