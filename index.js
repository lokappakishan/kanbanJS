//dom elements
const addTaskButtons = document.querySelectorAll('.btn-add-task');
const addNewBoardButton = document.getElementById('btn-add-board');
const todoBoard = document.querySelector('.board-1');
const items = document.querySelectorAll('item')
const boards = document.querySelectorAll('.board');
const boardContainer = document.querySelector('.board-container');


addTaskButtons.forEach((button)=>button.addEventListener('click',handleAddTask))
addNewBoardButton.addEventListener('click',handleAddNewBoard)
boards.forEach(attachBoardListeners)


function attachBoardListeners(board) {
    board.addEventListener('dragover', handleDragOver);
}

// handles dragover item to drop items
function handleDragOver(e) {
    e.preventDefault();
    const draggedItem = document.querySelector('.is-dragging');
    const board = e.currentTarget;
    const items = Array.from(board.querySelectorAll('.item'));

    // Find the closest item based on mouse position
    const closestItem = items.find(item => {
        const box = item.getBoundingClientRect();
        return e.clientY >= box.top && e.clientY <= box.bottom;
    });

    if (closestItem) {
        const box = closestItem.getBoundingClientRect();
        const offset = e.clientY - (box.top + box.height / 2);

        if (offset < 0) {
            board.insertBefore(draggedItem, closestItem); 
        } else {
            closestItem.after(draggedItem); 
        }
    } else {
        board.appendChild(draggedItem); 
    }
}


// Adds a new board
function handleAddNewBoard(e) {
    e.preventDefault()

    const addTaskButton = createNewElement('button',['btn-add-task'],{},'Add task');
    const boardHeader = createNewElement('div',['board-header'],{},'');
    
    let boardName = prompt('enter board name')
    if(!boardName) return

    const newBoard = createNewElement('div',['board'],{},'');
    attachBoardListeners(newBoard);
    
    const newBoardDeleteButton = createNewElement('button',['btn-delete'],{},'delete board')    
    
    newBoardDeleteButton.addEventListener('click',(e)=>{
        newBoard.remove()
    })

    addTaskButton.addEventListener('click',handleAddTask)

    const newBoardHeader = createNewElement('h2',[],{},boardName)    
    newBoardHeader.textContent = boardName;

    boardHeader.appendChild(newBoardHeader);
    boardHeader.appendChild(newBoardDeleteButton)
    boardHeader.appendChild(addTaskButton)
    newBoard.appendChild(boardHeader)
    boardContainer.appendChild(newBoard)
}

// handle new item click
function handleAddTask(e) {
    e.preventDefault()  
    const parent = e.target.parentElement;
    let taskValue = prompt('Enter task name')
    if(taskValue){
        addToTodoBoard(taskValue,parent.parentElement)        
    } else{
        alert('Please enter a valid task!');
    }   
}

// Custom tag creator
function createNewElement(tag,classNames = [],attributes = {},textContent =''){
    
    const newTag = document.createElement(tag)
    if (textContent) newTag.textContent = textContent;
    
    if (Array.isArray(classNames)) {
        classNames.forEach(className => newTag.classList.add(className));
    }

    if (attributes && typeof attributes === 'object') {
        Object.entries(attributes).forEach(([key, value]) => {
            newTag.setAttribute(key, value);
        });
    }

    return newTag;
}

// Adds new item to board
function addToTodoBoard(value,board) {
    
    let div = createNewElement('div',['item'],{draggable:true},'')    
    let p = createNewElement('p',[],{},value);
    let itemButtonsContainer = createNewElement('div',['buttons'],{},'')
    let deleteItemButton = createNewElement('button',[],{},'delete')
    let updateItemButton = createNewElement('button',[],{},'Update')

    deleteItemButton.addEventListener('click',()=>{
        div.remove()
    })

    updateItemButton.addEventListener('click',(e)=>{
        
        const item = e.currentTarget.parentElement.parentElement;
        const taskText = item.querySelector('p')

        const newTaskValue = prompt('Enter the new task name:', taskText.textContent);
        taskText.textContent = updateItemButton;

        if (newTaskValue && newTaskValue.trim() !== '') {
            taskText.textContent = newTaskValue.trim();
        } else {
            alert('Invalid task name. Please try again.');
        }
        
    })

    div.addEventListener('dragstart',(e)=> {
        div.classList.add('is-dragging')
    })

    div.addEventListener('dragend',(e)=>{
        div.classList.remove('is-dragging')
    })

    itemButtonsContainer.appendChild(deleteItemButton)
    itemButtonsContainer.appendChild(updateItemButton)
    div.appendChild(p)
    div.appendChild(itemButtonsContainer)
    board.appendChild(div);
}