const projectListDiv_el = document.getElementById('projectListDiv');

async function populateRecentProjects(){
    projectListDiv_el.innerHTML = '';

    activeProjects.sort((a, b) => {
        return new Date(b.previousTime) - new Date(a.previousTime);
    });

    for (const element of activeProjects){
        const projectItem_el = document.createElement('div');
        projectItem_el.classList.add('project-item-div');

        const projectName_el = document.createElement('p');
        projectName_el.textContent = element.project;

        const projectTimeText_el = document.createElement('p');
        const projectTime = await api.quickTimesHandler({request: 'Project', topicID: element.topicID, subtopicID: element.subtopicID, project: element.project})
        projectTimeText_el.textContent = projectTime;

        const projectTopicText_el = document.createElement('h5');
        const topicName = findTopicById(element.topicID);
        projectTopicText_el.textContent = topicName;
        

        const projectSubtopicText_el = document.createElement('h5');
        const subtopicName = findSubtopicById(element.subtopicID);
        projectSubtopicText_el.textContent = subtopicName;

        projectItem_el.append(projectName_el, projectTimeText_el, projectTopicText_el, projectSubtopicText_el);

        projectListDiv_el.append(projectItem_el);
    }
}

function findTopicById(id) {
    const foundObject = activeTopics.find(obj => obj.id === id);
    return foundObject ? foundObject.topic : null;
}

function findSubtopicById(id) {
    const foundObject = activeSubtopics.find(obj => obj.id === id);
    return foundObject ? foundObject.subtopic : null;
}