const addSubtopicButton_el = document.getElementById('addSubtopicButton');

addSubtopicButton_el.addEventListener('click', () => {
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '#addSubtopicContainer', addSubtopicListeners);
});

async function addSubtopicListeners(){
    const addSubtopicCloseButton_el = document.getElementById('addSubtopicCloseButton');
    const topicNameSelect_el = document.getElementById('topicNameSelect');
    const subtopicNameInput_el = document.getElementById('subtopicNameInput');
    const confirmAddSubtopicButton_el = document.getElementById('confirmAddSubtopicButton');
    await topicDropdownForAddSubtopic(topicNameSelect_el);

    addSubtopicCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    confirmAddSubtopicButton_el.addEventListener('click', async () => {
        if (subtopicNameInput_el.value === '') return subtopicNameInput_el.classList.add('error');
        const result = await api.subtopicHandler({request: 'Add', topicID: topicNameSelect_el.value, subtopicName: subtopicNameInput_el.value});
        if (result === true){
            overlayContainer_el.style.display = 'none';
        } else if (result === 'duplicate'){
            subtopicNameInput_el.classList.add('error');
        } else {
            subtopicNameInput_el.classList.add('error');
        }
    });
}

async function topicDropdownForAddSubtopic(dropdown) {
    dropdown.innerHTML = '';
    activeTopics.forEach(topic => {
        const option_el = document.createElement('option');
        option_el.textContent = topic.topic;
        option_el.value = topic.id; // Concatenate ID and name
        dropdown.append(option_el);
    });
}
