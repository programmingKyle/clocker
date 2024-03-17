const addTopicButton_el = document.getElementById('addTopicButton');

addTopicButton_el.addEventListener('click', () => {
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '#addTopicContainer', addTopicListeners);
});

function addTopicListeners(){
    const addTopicCloseButton_el = document.getElementById('addTopicCloseButton');
    const topicNameInput_el = document.getElementById('topicNameInput');
    const confirmAddTopicButton_el = document.getElementById('confirmAddTopicButton');

    addTopicCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    confirmAddTopicButton_el.addEventListener('click', async () => {
        if (topicNameInput_el.value === '') return topicNameInput_el.classList.add('error');
        const words = topicNameInput_el.value.toLowerCase().split(' ');
        const formattedWords = words.map(word => capitalizeFirstLetter(word));
        const formattedTopic = formattedWords.join(' ');
        const result = await api.topicHandler({request: 'Add', topicName: formattedTopic});
        if (result === true){
            await getAllActiveTopics();
            topicNameInput_el.value = '';
            overlayContainer_el.style.display = 'none';
        } else if (result === 'duplicate') {
            topicNameInput_el.classList.add('error');
        } else {
            topicNameInput_el.classList.add('error');
        }
    });
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
