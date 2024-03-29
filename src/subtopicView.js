// Will be used when user clicks on a topic to review its information and display subtopics
// topicListDiv_el

const subtopicViewBackButton_el = document.getElementById('subtopicViewBackButton');

async function populateSubtopics(topicID, topic) {
    topicSubtopicHeader_el.textContent = topic;
    topicListDiv_el.innerHTML = '';

    const noSubtopicItem_el = document.createElement('div');
    noSubtopicItem_el.classList.add('topic-item-div');

    const noSubtopicText_el = document.createElement('h3');
    noSubtopicText_el.textContent = 'No Subtopic';

    const time = await api.quickTimesHandler({ request: 'Subtopic', topicID, subtopicID: 'null' });

    const noSubtopicTimeText_el = document.createElement('h3');
    noSubtopicTimeText_el.textContent = time;

    noSubtopicItem_el.addEventListener('click', async () => {
        subjectViewLocation = 2;
        currentSelectedSubtopic = 'null';
        await populate30DayGraph('Subtopic', 'null');
        await populateWeeklyCompareGraph('Subtopic', 'null');
        await populateAnnualGraph('Subtopic', 'null');
        await populateProjects('null', 'Projects');
        await populateSpecificQuickTimes('subtopic', 'null');
    });

    topicListDiv_el.append(noSubtopicItem_el);
    noSubtopicItem_el.append(noSubtopicText_el, noSubtopicTimeText_el);

    const filteredSubtopics = activeSubtopics.filter(element => parseInt(element.topicID) === parseInt(topicID));

    filteredSubtopics.forEach(async (element) => {
        const subtopicItemDiv_el = document.createElement('div');
        subtopicItemDiv_el.classList.add('topic-item-div');
    
        const subtopicNameText_el = document.createElement('h3');
        subtopicNameText_el.textContent = element.subtopic;
    
        const time = await api.quickTimesHandler({ request: 'Subtopic', topicID: element.topicID, subtopicID: element.id });
    
        const subtopicTime_el = document.createElement('h3');
        subtopicTime_el.textContent = time;
    
        topicListDiv_el.append(subtopicItemDiv_el);
        subtopicItemDiv_el.append(subtopicNameText_el, subtopicTime_el);
    
        // Add event listener using a closure to capture the current value of 'element'
        subtopicItemDiv_el.addEventListener('click', async () => {
            subjectViewLocation = 2;
            currentSelectedSubtopic = element.id;
            await populate30DayGraph('Subtopic', element.id);
            await populateAnnualGraph('Subtopic', element.id);
            await populateWeeklyCompareGraph('Subtopic', element.id);
            await populateProjects(element.id, 'Projects');
            await populateSpecificQuickTimes('subtopic', element.id);
        });

        subtopicItemDiv_el.addEventListener('contextmenu', (event) => {
            if (event.button === 2){
                rightClickMenuToggle(element, event, 'Subtopic');
            }
        })
    });
}

subtopicViewBackButton_el.addEventListener('click', async () => {
    subjectViewLocation -= 1;
    if (subjectViewLocation === 0){
        subtopicViewBackButton_el.style.display = 'none';
        await populateQuickTimes();
        await populateTopicView();
        await populate30DayGraph('All');
        await populateAnnualGraph('All');
        await populateWeeklyCompareGraph('All');
        currentSelectedTopic = null;
    } else if (subjectViewLocation === 1){
        await populateSubtopics(currentSelectedTopic.id, currentSelectedTopic.topic);
        await populateSpecificQuickTimes('topic', currentSelectedTopic.id);
        await populate30DayGraph('Topic', currentSelectedTopic.id);
        await populateAnnualGraph('Topic', currentSelectedTopic.id);
        await populateWeeklyCompareGraph('Topic', currentSelectedTopic.id);
    }
});