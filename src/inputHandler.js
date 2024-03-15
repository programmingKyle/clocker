// This handles all the drop down menus and start / stop buttons
const topicSelect_el = document.getElementById('topicSelect');

const subtopicSelect_el = document.getElementById('subtopicSelect');
const addSubtopicButton_el = document.getElementById('addSubtopicButton');

async function populateTopicSelect(){
    topicSelect_el.innerHTML = '';
    if (activeTopics.length > 0){
        addSubtopicButton_el.style.visibility = 'visible';
        activeTopics.forEach(element => {
            const topicOption_el = document.createElement('option');
            topicOption_el.textContent = element.topic;
            topicSelect_el.append(topicOption_el);
        });    
    } else {
        addSubtopicButton_el.style.visibility = 'hidden';
    }
}
