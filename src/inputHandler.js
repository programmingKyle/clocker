// This handles all the drop down menus and start / stop buttons
const topicSelect_el = document.getElementById('topicSelect');

async function populateTopicSelect(){
    topicSelect_el.innerHTML = '';
    activeTopics.forEach(element => {
        const topicOption_el = document.createElement('option');
        topicOption_el.textContent = element.topic;

        topicSelect_el.append(topicOption_el);
    });
}
