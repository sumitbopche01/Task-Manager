// localStorage.clear();

/**
 * Loading data from localstorage and assign default values
 */
let todoTaskArray = JSON.parse(localStorage.getItem("todo")) || [];
let ongoingTaskArray = JSON.parse(localStorage.getItem("ongoing")) || [];
let doneTaskArray = JSON.parse(localStorage.getItem("done")) || [];
let filterApplied = JSON.parse(localStorage.getItem("filters")) || [];

/**
 * calling renderUserInterface so that it renders on load
 */
renderUserInterface(todoTaskArray, 'todo');
renderUserInterface(ongoingTaskArray, 'ongoing');
renderUserInterface(doneTaskArray, 'done');

/**
 * 
 * @param {Array} taskList List of tasks to render
 * @param {String} renderingPlace Place where to render ex. todo, ongoing, done
 */
function renderUserInterface(taskList, renderingPlace) {
    let divElement = "";
    let section = renderingPlace;
    for (let i = 0; i < taskList.length; i++) {
        divElement += `<div class="taskInHand">
        <p class="taskDetails">${taskList[i].title}</p>
        <p class="priorityInfo">Priority: ${taskList[i].priority}</p>
        <p class="dateInfo">Created At: ${taskList[i].createdAt}</p>`
        if (section === 'todo') {
            divElement += `<button type="button" class="startWorkingBtn" onclick = "startWorkingOnTask(${i})">Start Task</button>
            <button type="button" class="doneBtn" onclick = "completedTheTask(${i},'${section}')" > Done </button>  
            <button type="button" class="deleteBtn" onclick = "deleteTask(${i},'${section}')">Delete</button> </div>`
        } else if (section === 'ongoing') {
            divElement += `<button type="button" class="doneBtn" onclick = "completedTheTask(${i},'${section}')" > Done </button>  
            <button type="button" class="deleteBtn" onclick = "deleteTask(${i},'${section}')">Delete</button> </div>`;
        } else if (section === 'done') {
            divElement += `<button type="button" class="deleteBtn" onclick = "deleteTask(${i},'${section}')"> Delete </button> </div>`;
        }
    }
    document.getElementById(renderingPlace).innerHTML = divElement;
}

/** 
 * @description Method called when we want to create new task and this new task will be stored 
 * in localstorage
 */
function newElement() {
    let taskTitle = document.getElementById('taskInput').value;
    let priorityEvent = document.getElementById('priority');
    let selectedPriority = priorityEvent.options[priorityEvent.selectedIndex].value;
    if (taskTitle === '') {
        alert("You must write something");
        return;
    }
    let dateObj = new Date();
    let newTaskObj = {
        title: taskTitle,
        status: "todo",
        createdAt: dateObj.getDate() + " / " + (dateObj.getMonth() + 1) + " / " + dateObj.getFullYear(),
        timestamp: Date.now(),
        priority: selectedPriority
    }

    todoTaskArray.push(newTaskObj);

    localStorage.setItem("todo", JSON.stringify(todoTaskArray));

    document.getElementById("taskInput").value = "";
    renderUserInterface(todoTaskArray, "todo");
}

/**
 * 
 * @param {integer} index index of task which we want to move from todo task list to ongoing task list
 */
function startWorkingOnTask(index) {
    let dataToMove = todoTaskArray.splice(index, 1);

    localStorage.setItem('todo', JSON.stringify(todoTaskArray));

    dataToMove[0].status = "ongoing";
    ongoingTaskArray.unshift(dataToMove[0]);

    localStorage.setItem('ongoing', JSON.stringify(ongoingTaskArray));

    renderUserInterface(ongoingTaskArray, "ongoing");
    renderUserInterface(todoTaskArray, "todo");
}

/**
 * 
 * @param {Integer} index index of task which we want mark as complete. This will be shown in done task list
 * @param {String} section The section or renderingPlace from where it is being called so that we update
 * or rerender that section only
 */
function completedTheTask(index, section) {
    let dataToMove;
    if (section === "todo") {
        dataToMove = todoTaskArray.splice(index, 1);

        localStorage.setItem('todo', JSON.stringify(todoTaskArray));

        renderUserInterface(todoTaskArray, 'todo');
    } else if (section === "ongoing") {
        dataToMove = ongoingTaskArray.splice(index, 1);
        
        localStorage.setItem('ongoing', JSON.stringify(ongoingTaskArray));

        renderUserInterface(ongoingTaskArray, 'ongoing');
    }

    dataToMove[0].status = "done";
    doneTaskArray.unshift(dataToMove[0]);

    localStorage.setItem('done', JSON.stringify(doneTaskArray));

    renderUserInterface(doneTaskArray, 'done');
}

/**
 * 
 * @param {interger} indexToDelete 
 * @param {string} section from where it is being called so that we only render 
 * that section only and avoid unnecessary
 * 
 */
function deleteTask(indexToDelete, section) {
    if (section == 'todo') {
        todoTaskArray.splice(indexToDelete, 1);

        localStorage.setItem('todo', JSON.stringify(todoTaskArray));

        renderUserInterface(todoTaskArray, section);
    } else if (section == "ongoing") {
        ongoingTaskArray.splice(indexToDelete, 1);

        localStorage.setItem('ongoing', JSON.stringify(ongoingTaskArray));

        renderUserInterface(ongoingTaskArray, section);
    } else {
        doneTaskArray.splice(indexToDelete, 1);

        localStorage.setItem('done', JSON.stringify(doneTaskArray));

        renderUserInterface(doneTaskArray, section);
    }
}


/**
 * 
 * @param {Array} filterToAdd 
 */
function addFilter(filterToAdd) {
    let indexOfFilter = filterApplied.indexOf(filterToAdd);
    indexOfFilter === -1 ? filterApplied.push(filterToAdd) : filterApplied.splice(indexOfFilter, 1);

    localStorage.setItem('filters', JSON.stringify(filterApplied));

    applyFilter(filterApplied);
}

/**
 * 
 * @param {Array} filterApplied List of filters applied and this will be used whenever list is updated
 */
function applyFilter(filterApplied) {
    let filteredTodo, filteredOngoing,filteredDone;

    if (filterApplied.length == 0) {
        filteredTodo = todoTaskArray;
        filteredOngoing = ongoingTaskArray;
        filteredDone = doneTaskArray;
    }
    else{
        filteredTodo = filterArray(todoTaskArray);
        filteredOngoing = filterArray(ongoingTaskArray);
        filteredDone = filterArray(doneTaskArray);
    }

    console.log("filtered todo --- ", filteredTodo, "ongoing ---- ", filteredOngoing," done array --- ", filteredDone);
    renderUserInterface(filteredTodo, 'todo');
    renderUserInterface(filteredOngoing, 'ongoing');
    renderUserInterface(filteredDone, 'done');
}

/**
 * 
 * @param {Array} toFilterArray The array on which we want to apply filter. Return filtered array.
 */
function filterArray(toFilterArray) {
    return toFilterArray.filter(currentTask => filterApplied.indexOf(currentTask.priority) !== -1 ? 1 : 0);
}

function sortTasks(sortBy) {
    let sortedTodo, sortedOngoing, sortedDone;
    if (sortBy == 'priority') {
        todoTaskArray = sortByPriority(todoTaskArray);
        ongoingTaskArray = sortByPriority(ongoingTaskArray);
        doneTaskArray = sortByPriority(doneTaskArray);
    } else if (sortBy == 'date') {
        todoTaskArray = sortByDate(todoTaskArray);
        ongoingTaskArray = sortByDate(ongoingTaskArray);
        doneTaskArray = sortByDate(doneTaskArray);
    } else if (sortBy = "none") {
        todoTaskArray = JSON.parse(localStorage.getItem("todo")) || [];
        ongoingTaskArray = JSON.parse(localStorage.getItem("ongoing")) || [];
        doneTaskArray = JSON.parse(localStorage.getItem("done")) || [];
    }

    applyFilter(filterApplied);
}

/**
 * 
 * @param {Array} arrayToSort Array which we want to sort on priority basis
 */
function sortByPriority(arrayToSort) {
    arrayToSort.sort((a, b) => {
        if (a.priority < b.priority) {
            return -1;
        } else if (a.priority > b.priority) {
            return 1;
        }
        return 0;
    });

    return arrayToSort;
}

function sortByDate(arrayToSort) {

    arrayToSort.sort((a, b) => {
        console.log("a timestamp ", a.timestamp, "  b.timestamp -- ", b.timestamp);
        console.log()
        return ( parseInt(b.timestamp) - parseInt(a.timestamp) );
    });
    return arrayToSort;
}

(function renderingFilters(filterApplied) {
    let optionsStr = `<span>Select Filters:</span> <label><input type="checkbox" name="priority" value="P0" onclick="addFilter('P0')" 
    ${filterApplied.indexOf('P0') !== -1 ? "checked" : "" }>P0</label>
    <label><input type="checkbox" name="priority" value="P1" onclick="addFilter('P1')"
    ${filterApplied.indexOf('P1') !== -1 ? "checked" : "" }>P1</label>
    <label><input type="checkbox" name="priority" value="P2" onclick="addFilter('P2')"
    ${filterApplied.indexOf('P2') !== -1 ? "checked" : "" }>P2</label>
    <label><input type="checkbox" name="priority" value="P3" onclick="addFilter('P3')"
    ${filterApplied.indexOf('P3') !== -1 ? "checked" : "" }>P3</label>`

    document.getElementById('filtersDiv').innerHTML = optionsStr;
})(filterApplied);