// This is the final layer to the Subject view
// This will show all projects relating to a specific subtopic

async function populateProjects(subtopicID, label){
    topicSubtopicHeader_el.textContent = label;
    topicListDiv_el.innerHTML = '';
    const filteredProjects = activeProjects.filter(element => element.subtopicID === subtopicID);
    filteredProjects.forEach(async (element) => {
        const projectItemDiv_el = document.createElement('div');
        projectItemDiv_el.classList.add('topic-item-div');

        const projectNameText_el = document.createElement('h3');
        projectNameText_el.textContent = element.project;

        const time = await api.quickTimesHandler({request: 'Project', topicID: element.topicID, subtopicID: subtopicID, project: element.project})
        
        const projectTime_el = document.createElement('h3');
        projectTime_el.textContent = time;

        topicListDiv_el.append(projectItemDiv_el);
        projectItemDiv_el.append(projectNameText_el, projectTime_el);

        // Add event listener using a closure to capture the current value of 'element'
        projectItemDiv_el.addEventListener('click', async () => {
            topicSelect_el.value = currentSelectedTopic.id;
            await populateSubtopicSelect(currentSelectedTopic.id);
            subtopicSelect_el.value = currentSelectedSubtopic;
            projectInput_el.value = element.project;
        });

        projectItemDiv_el.addEventListener('contextmenu', (event) => {
            if (event.button === 2){
                rightClickMenuToggle(element, event, 'Project');
            }
        })

    });
}