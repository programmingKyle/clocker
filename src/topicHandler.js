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

    const inputValue = () => {
        if (subject === 'Topic'){
            return element.topic;
        } else if (subject === 'Subtopic'){
            return element.subtopic;
        } else {
            return element.project;
        }
    }

    editSubjectInput_el.value = inputValue();

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
            await populateSubtopics(currentSelectedTopic.id, currentSelectedTopic.topic);
        } else if (subject === 'Project') {
            await api.projectHandler({request: 'Edit', projectID: element.id, newName: editSubjectInput_el.value});
            console.log('Time to edit the project');
        }
        editSubjectInput_el.value = '';
        await getAllActiveProjects();
        overlayContainer_el.style.display = 'none';
    });
}

function deleteSubjectListeners(element, subject){
    const deleteSubjectTitleText_el = document.getElementById('deleteSubjectTitleText');
    const deleteSubjectCloseButton_el = document.getElementById('deleteSubjectCloseButton');
    const deleteSubjectInput_el = document.getElementById('deleteSubjectInput');
    const confirmDeleteSubjectButton_el = document.getElementById('confirmDeleteSubjectButton');

    deleteSubjectTitleText_el.textContent = `Edit ${subject}`;

    deleteSubjectCloseButton_el.addEventListener('click', () => {
        currentItem = null;
        selectedSubject = '';
        overlayContainer_el.style.display = 'none';
    });

    confirmDeleteSubjectButton_el.addEventListener('click', async () => {
        if (deleteSubjectInput_el.value === 'DELETE'){
            if (subject === 'Topic'){
                await api.topicHandler({request: 'Delete', topicID: element.id});
            } else if (subject === 'Subtopic'){
                await api.subtopicHandler({request: 'Delete', subtopicID: element.id});
            }
            confirmDeleteSubjectButton_el.value = '';
            await getAllActiveTopics();
            await getAllActiveProjects();
            overlayContainer_el.style.display = 'none';
            projectInput_el.value = '';
        } else {
            deleteSubjectInput_el.classList.add('error');
            errorTimeout(deleteSubjectInput_el);
        }
    });
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
