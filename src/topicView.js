const topicListDiv_el = document.getElementById('topicListDiv');

function populateTopicView(){
    activeTopics.forEach(element => {
        const topicItemDiv_el = document.createElement('div');
        topicItemDiv_el.classList.add('topic-item-div');

        const topicName_el = document.createElement('h3');
        topicName_el.textContent = element.topic;

        const topicTime_el = document.createElement('h3');
        topicTime_el.textContent = '10.5';

        topicListDiv_el.append(topicItemDiv_el);
        topicItemDiv_el.append(topicName_el, topicTime_el);
    });
}