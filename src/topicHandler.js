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

// Used for both topics and subtopics
function editSubjectListeners(element, subject){
    const editSubjectTitleText_el = document.getElementById('editSubjectTitleText');
    const editSubjectCloseButton_el = document.getElementById('editSubjectCloseButton');
    const editSubjectInput_el = document.getElementById('editSubjectInput');
    const confirmEditSubjectButton_el = document.getElementById('confirmEditSubjectButton');

    editSubjectTitleText_el.textContent = `Edit ${subject}`;
    editSubjectInput_el.value = subject === 'Topic' ? element.topic : element.subtopic;

    editSubjectCloseButton_el.addEventListener('click', () => {
        currentItem = null;
        selectedSubject = '';
        overlayContainer_el.style.display = 'none';
    });

    confirmEditSubjectButton_el.addEventListener('click', async () => {
        if (subject === 'Topic'){
            await api.topicHandler({request: 'Edit', topicID: element.id, newName: editSubjectInput_el.value});
            await getAllActiveTopics();
        } else if (subject === 'Subtopic'){
            await api.subtopicHandler({request: 'Edit', subtopicID: element.id, newName: editSubjectInput_el.value});
            await getAllActiveSubtopics();
        }
        editSubjectInput_el.value = '';
        await getAllActiveTopics();
        await getAllActiveProjects();
        overlayContainer_el.style.display = 'none';
    });
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
