// Will be used to grab all information needed to populate all information on the front end
// Will probably be a lot of let variables that will be used here

let activeTopics;

document.addEventListener('DOMContentLoaded', async () => {
    await getAllActiveTopics();
});

async function getAllActiveTopics(){
    activeTopics = await api.topicHandler({request: 'Get', status: 'active'});
    await populateTopicSelect();
}
