// This is the final layer to the Subject view
// This will show all projects relating to a specific subtopic

async function populateProjects(subtopicID, label){
    topicSubtopicHeader_el.textContent = label;
    topicListDiv_el.innerHTML = '';
    const filteredProjects = activeProjects.filter(element => parseInt(element.subtopicID) === parseInt(subtopicID))

    filteredProjects.forEach(async (element) => {
        const projectItemDiv_el = document.createElement('div');
        projectItemDiv_el.classList.add('topic-item-div');

        const projectNameText_el = document.createElement('h3');
        projectNameText_el.textContent = element.project;

        const time = '1.5';
        
        const projectTime_el = document.createElement('h3');
        projectTime_el.textContent = time;

        topicListDiv_el.append(projectItemDiv_el);
        projectItemDiv_el.append(projectNameText_el, projectTime_el);
    });
}