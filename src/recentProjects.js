const projectListDiv_el = document.getElementById('projectListDiv');

function populateRecentProjects(){
    console.log(activeTopics);

    activeProjects.forEach(element => {
        const projectItem_el = document.createElement('div');
        projectItem_el.classList.add('project-item-div');

        const projectName_el = document.createElement('p');
        projectName_el.textContent = element.project;

        const projectTimeText_el = document.createElement('p');
        projectTimeText_el.textContent = 'NA YET';

        const projectTopicText_el = document.createElement('h5');
        const topicName = findTopicById(element.topicID);
        projectTopicText_el.textContent = topicName;
        

        const projectSubtopicText_el = document.createElement('h5');
        const subtopicName = findSubtopicById(element.subtopicID);
        projectSubtopicText_el.textContent = subtopicName;

        projectItem_el.append(projectName_el, projectTimeText_el, projectTopicText_el, projectSubtopicText_el);

        projectListDiv_el.append(projectItem_el);
    });
}

function findTopicById(id) {
    const foundObject = activeTopics.find(obj => obj.id === id);
    return foundObject ? foundObject.topic : null;
}

function findSubtopicById(id) {
    const foundObject = activeSubtopics.find(obj => obj.id === id);
    return foundObject ? foundObject.subtopic : null;
}