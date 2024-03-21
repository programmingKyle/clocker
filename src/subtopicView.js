// Will be used when user clicks on a topic to review its information and display subtopics
// topicListDiv_el
const subtopicViewBackButton_el = document.getElementById('subtopicViewBackButton');

async function populateSubtopics(topic){
    console.log(topic);
    topicSubtopicHeader_el.textContent = 'Subtopics';
    topicListDiv_el.innerHTML = '';
}

subtopicViewBackButton_el.addEventListener('click', async () => {
    await populateTopicView();
});