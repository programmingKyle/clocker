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


}

async function topicDropdownForAddSubtopic(dropdown){
    dropdown.innerHTML = '';
    activeTopics.forEach(element => {
        const select_el = document.createElement('option');
        select_el.textContent = element.topic;
        dropdown.append(select_el);
    });
}