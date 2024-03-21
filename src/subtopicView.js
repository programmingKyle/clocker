// Will be used when user clicks on a topic to review its information and display subtopics
// topicListDiv_el
const subtopicViewBackButton_el = document.getElementById('subtopicViewBackButton');

async function populateSubtopics(topicID, topic){
    topicSubtopicHeader_el.textContent = topic;
    topicListDiv_el.innerHTML = '';

    const noSubtopicItem_el = document.createElement('div');
    noSubtopicItem_el.classList.add('topic-item-div');

    const noSubtopicText_el = document.createElement('h3');
    noSubtopicText_el.textContent = 'No Subtopic';

    const noSubtopicTimeText_el = document.createElement('h3');
    noSubtopicTimeText_el.textContent = '1.5';

    topicListDiv_el.append(noSubtopicItem_el);
    noSubtopicItem_el.append(noSubtopicText_el, noSubtopicTimeText_el);

    activeSubtopics.forEach(element => {
        if (parseInt(topicID) === parseInt(element.topicID)){
            const subtopicItemDiv_el = document.createElement('div');
            subtopicItemDiv_el.classList.add('topic-item-div');

            const subtopicNameText_el = document.createElement('h3');
            subtopicNameText_el.textContent = element.subtopic;

            const subtopicTime_el = document.createElement('h3');
            subtopicTime_el.textContent = '1.5';

            topicListDiv_el.append(subtopicItemDiv_el);
            subtopicItemDiv_el.append(subtopicNameText_el, subtopicTime_el);
        }
    });
}

subtopicViewBackButton_el.addEventListener('click', async () => {
    await populateTopicView();
});