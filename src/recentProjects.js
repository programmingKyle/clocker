const projectListDiv_el = document.getElementById('projectListDiv');

function populateRecentProjects(){
    console.log(activeProjects);

    activeProjects.forEach(element => {
        const projectItem_el = document.createElement('div');
        projectItem_el.classList.add('project-item-div');

        const projectName_el = document.createElement('p');
        projectName_el.textContent = element.project;

        const projectTimeText_el = document.createElement('p');
        projectTimeText_el.textContent = 'NA YET';

        const projectTopicText_el = document.createElement('h5');
        projectTopicText_el.textContent = 'NA YET';

        const projectSubtopicText_el = document.createElement('h5');
        projectSubtopicText_el.textContent = 'NA YET';

        projectItem_el.append(projectName_el, projectTimeText_el, projectTopicText_el, projectSubtopicText_el);

        projectListDiv_el.append(projectItem_el);
    });
}