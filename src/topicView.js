const topicListDiv_el = document.getElementById('topicListDiv');
const topicSubtopicHeader_el = document.getElementById('topicSubtopicHeader');

let currentSelectedTopic;

// Used to tell where in navigation it is so it can be used for the back button
// 0 is home, 1 is topics, 2 is subtopics
let subjectViewLocation = 0;


async function populateTopicView(){
    topicSubtopicHeader_el.textContent = 'Topics';
    topicListDiv_el.innerHTML = '';
    for (const element of activeTopics){
        const topicItemDiv_el = document.createElement('div');
        topicItemDiv_el.classList.add('topic-item-div');

        const time = await api.quickTimesHandler({request: 'Topic', topicID: element.id});

        const topicName_el = document.createElement('h3');
        topicName_el.textContent = element.topic;

        const topicTime_el = document.createElement('h3');
        topicTime_el.textContent = time;

        topicListDiv_el.append(topicItemDiv_el);
        topicItemDiv_el.append(topicName_el, topicTime_el);

        topicItemDiv_el.addEventListener('click', async () => {
            subjectViewLocation = 1;
            subtopicViewBackButton_el.style.display = 'block';
            currentSelectedTopic = ({id: element.id, topic: element.topic});
            await populate30DayGraph('Topic', element.id);
            await populateAnnualGraph('Topic', element.id);
            await populateSubtopics(element.id, element.topic);
            await populateSpecificQuickTimes('topic', element.id);
        });

        topicItemDiv_el.addEventListener('contextmenu', (event) => {
            if (event.button === 2){
                rightClickMenuToggle(element, event, 'Topic');
            }
        });
    }
}
