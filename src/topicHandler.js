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
        const result = await api.topicHandler({request: 'Add', topicName: topicNameInput_el.value});
        console.log(result);
        if (result === true){
            topicNameInput_el.value = '';
            overlayContainer_el.style.display = 'none';    
        } else if (result === 'duplicate') {
            topicNameInput_el.classList.add('error');
        } else {
            topicNameInput_el.classList.add('error');
        }
    });
}