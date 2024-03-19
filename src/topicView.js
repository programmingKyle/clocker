const topicListDiv_el = document.getElementById('topicListDiv');

async function populateTopicView(){
    for (const element of activeTopics){
        const topicItemDiv_el = document.createElement('div');
        topicItemDiv_el.classList.add('topic-item-div');

        const time = await api.quickTimesHandler({request: 'Topic', topicID: element.id});

        const topicName_el = document.createElement('h3');
        topicName_el.textContent = element.topic;

        const topicTime_el = document.createElement('h3');
        topicTime_el.textContent = time;

        topicListDiv_el.append(topicItemDiv_el);
        topicItemDiv_el.append(topicName_el, topicTime_el);
    }
}
