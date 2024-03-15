// This handles all the drop down menus and start / stop buttons
const topicSelect_el = document.getElementById('topicSelect');

const subtopicSelect_el = document.getElementById('subtopicSelect');

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
    } else {
        addSubtopicButton_el.style.visibility = 'hidden';
    }
}

topicSelect_el.addEventListener('change', async () => {
    await populateSubtopicSelect(topicSelect_el.value);
});

async function populateSubtopicSelect(topic){
    subtopicSelect_el.innerHTML = '';
    activeSubtopics.forEach(element => {
        console.log(topic, element.topicID);
        if (parseInt(topic) === parseInt(element.topicID)){
            const subtopicOption_el = document.createElement('option');
            subtopicOption_el.textContent = element.subtopic;
            subtopicOption_el.value = element.topicID;
            subtopicSelect_el.append(subtopicOption_el);
        }
    });
}
