// Will be used to grab all information needed to populate all information on the front end
// Will probably be a lot of let variables that will be used here

let activeTopics;
let activeSubtopics;
let activeProjects;

document.addEventListener('DOMContentLoaded', async () => {
    await getAllActiveSubtopics();
    await getAllActiveTopics();
    await getAllActiveProjects();
});

async function getAllActiveTopics(){
    activeTopics = await api.topicHandler({request: 'Get', status: 'active'});
    await populateTopicSelect();
}

async function getAllActiveSubtopics(){
    activeSubtopics = await api.subtopicHandler({request: 'Get', status: 'active'});
}

async function getAllActiveProjects(){
    activeProjects = await api.projectHandler({request: 'Get'});
    console.log(activeProjects);
}
