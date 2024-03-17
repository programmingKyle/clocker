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

    topicNameSelect_el.value = topicSelect_el.value;

    addSubtopicCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    subtopicNameInput_el.addEventListener('click', () => {
        if (subtopicNameInput_el.classList.contains('error')){
            subtopicNameInput_el.classList.remove('error');
        }
    })

    confirmAddSubtopicButton_el.addEventListener('click', async () => {
        if (subtopicNameInput_el.value === '') return subtopicNameInput_el.classList.add('error');
        const words = subtopicNameInput_el.value.split(' ');
        const formattedWords = words.map(word => capitalizeFirstLetter(word));
        const formattedTopic = formattedWords.join(' ');
        const result = await api.subtopicHandler({request: 'Add', topicID: topicNameSelect_el.value, subtopicName: formattedTopic});
        if (result === true){
            await getAllActiveSubtopics();
            await populateSubtopicSelect(topicSelect_el.value);
            overlayContainer_el.style.display = 'none';
            if (subtopicNameInput_el.classList.contains('error')){
                subtopicNameInput_el.classList.remove('error');
            }    
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
