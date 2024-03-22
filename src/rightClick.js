const rightClickMenu_el = document.getElementById('rightClickMenu');
//const rightClickStatusButton_el = document.getElementById('rightClickStatusButton');
const rightClickEditButton_el = document.getElementById('rightClickEditButton');
const rightClickDeleteButton_el = document.getElementById('rightClickDeleteButton');

let currentItem;
let selectedSubject; // This will return either Topic or Subject

function rightClickMenuToggle(item, event, subject){
    console.log(item);
    currentItem = item;
    selectedSubject = subject;
    menuDisplay(event);
}

function menuDisplay(e) {
    e.preventDefault();

    rightClickMenu_el.style.display = 'block';

    // Reset position and size properties
    rightClickMenu_el.style.right = 'auto';
    rightClickMenu_el.style.bottom = 'auto';
    rightClickMenu_el.style.width = 'auto'; // e.g., '200px'
    rightClickMenu_el.style.height = 'auto'; // e.g., '150px'

    // Get the dimensions of the window
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate the adjusted position to ensure the menu stays within the window
    const adjustedRight = windowWidth - e.clientX;
    const adjustedBottom = windowHeight - e.clientY;

    // Adjust the position based on the mouse click
    rightClickMenu_el.style.left = e.clientX <= windowWidth / 2 ? `${e.clientX}px` : 'auto';
    rightClickMenu_el.style.right = e.clientX > windowWidth / 2 ? `${adjustedRight}px` : 'auto';
    rightClickMenu_el.style.top = e.clientY <= windowHeight / 2 ? `${e.clientY}px` : 'auto';
    rightClickMenu_el.style.bottom = e.clientY > windowHeight / 2 ? `${adjustedBottom}px` : 'auto';
}

document.addEventListener('click', () => {
    rightClickMenu_el.style.display = 'none';
});

/*
rightClickStatusButton_el.addEventListener('click', () => {
    console.log('Edit Status');
});
*/

rightClickEditButton_el.addEventListener('click', () => {
    console.log('Edit Name');
    rightClickMenu_el.style.display = 'none';
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '#editSubjectContainer', () => {
        editSubjectListeners(currentItem, selectedSubject);
    });
});

rightClickDeleteButton_el.addEventListener('click', () => {
    console.log('Delete');
});
