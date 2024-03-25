// This is the final layer to the Subject view
// This will show all projects relating to a specific subtopic

async function populateProjects(subtopicID, label){
    console.log(label);
    topicSubtopicHeader_el.textContent = label;
    topicListDiv_el.innerHTML = '';

    console.log(activeProjects);

    const filteredProjects = activeProjects.filter(element => parseInt(element.subtopicID) === parseInt(subtopicID))
    console.log(filteredProjects);
}