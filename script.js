const taskInput = document.getElementById("taskinput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("tasklist");
const searchInput =document.getElementById("searchInput");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light Mode";
}

 

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingIndex = null;

// Save tasks
function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display all tasks
function renderTask() {

    taskList.innerHTML = "";
    const SearchText = searchInput.value.toLowerCase();

    if(tasks.length === 0){

        taskList.innerHTML = "<li>📋 No tasks available.</li>";

    }

    themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀️ Light Mode";

    } else {

        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙 Dark Mode";

    }

});


    tasks.forEach(function (task, index) {

        if(!task.text.toLowerCase().includes(SearchText)){
            return;
        }

        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.text;

        // Show completed style
        if (task.completed) {
            span.classList.add("completed");
        }

        // Toggle completed
        span.addEventListener("click", function () {

            tasks[index].completed = !tasks[index].completed;

            saveTask();
            renderTask();

        });

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏ Edit";

        editBtn.addEventListener("click", function () {

            taskInput.value = tasks[index].text;

            editingIndex = index;

            addBtn.textContent = "Update";

        });


        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑 Delete";

        deleteBtn.addEventListener("click", function () {

            tasks.splice(index, 1);

            saveTask();
            renderTask();

        });

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;

}

 searchInput.addEventListener("input", function () {

    renderTask();

});

// Add / Update Task
addBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    taskInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        addBtn.click();
    }

});

    // Update existing task
    if (editingIndex !== null) {

        tasks[editingIndex].text = task;

        editingIndex = null;

        addBtn.textContent = "Add";

        taskInput.value="";

    } else {

        // Add new task
        tasks.push({
            text: task,
            completed: false
        });

    }

    saveTask();
    renderTask();

    taskInput.value = "";

});

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addBtn.click();
    }

});

// Load tasks when page opens

renderTask();

