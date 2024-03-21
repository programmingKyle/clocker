// Will be used when user clicks on a topic to review its information and display subtopics
// topicListDiv_el

async function populateSubtopics(topic){
    console.log(topic);
    topicSubtopicHeader_el.textContent = 'Subtopics';
    topicListDiv_el.innerHTML = '';
}