const taskInput = document.getElementById("taskinput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("tasklist");
const searchInput = document.getElementById("searchInput");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const themeBtn = document.getElementById("themeBtn");
const sortTasks = document.getElementById("sortTasks");

// Load Theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light Mode";
}

// Load Tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingIndex = null;

// Save Tasks
function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTask() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    // Sort Tasks
    if (sortTasks.value === "priority") {

        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3
        };

        tasks.sort(function (a, b) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

    }

    // No Tasks
    if (tasks.length === 0) {

        taskList.innerHTML = "<li>📋 No tasks available.</li>";

        totalTasks.textContent = 0;
        completedTasks.textContent = 0;
        pendingTasks.textContent = 0;

        return;
    }

    tasks.forEach(function (task, index) {

        if (!task.text.toLowerCase().includes(searchText)) {
            return;
        }

        const li = document.createElement("li");

        // Task Name
        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        span.addEventListener("click", function () {

            tasks[index].completed = !tasks[index].completed;

            saveTask();
            renderTask();

        });

        // Due Date
        const dateSpan = document.createElement("span");
        dateSpan.textContent = task.dueDate || "";
        dateSpan.classList.add("date");

        // Priority
        const prioritySpan = document.createElement("span");
        prioritySpan.textContent = task.priority;
        prioritySpan.classList.add("priority");

        if (task.priority === "High") {
            prioritySpan.classList.add("high");
        } else if (task.priority === "Medium") {
            prioritySpan.classList.add("medium");
        } else {
            prioritySpan.classList.add("low");
        }

        // Edit
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏ Edit";

        editBtn.addEventListener("click", function () {

            taskInput.value = task.text;
            priority.value = task.priority;
            dueDate.value = task.dueDate;

            editingIndex = index;

            addBtn.textContent = "Update";

        });

        // Delete
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑 Delete";

        deleteBtn.addEventListener("click", function () {

            tasks.splice(index, 1);

            saveTask();
            renderTask();

        });

        li.appendChild(span);
        li.appendChild(dateSpan);
        li.appendChild(prioritySpan);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    // Counters
    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;
}

// Search
searchInput.addEventListener("input", function () {
    renderTask();
});

// Dark Mode
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

// Sort
sortTasks.addEventListener("change", function () {
    renderTask();
});

// Add / Update Task
addBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    if (editingIndex !== null) {

        tasks[editingIndex].text = task;
        tasks[editingIndex].priority = priority.value;
        tasks[editingIndex].dueDate = dueDate.value;

        editingIndex = null;

        addBtn.textContent = "Add";

    } else {

        tasks.push({
            text: task,
            completed: false,
            priority: priority.value,
            dueDate: dueDate.value
        });

    }

    saveTask();
    renderTask();

    taskInput.value = "";
    dueDate.value = "";
    priority.selectedIndex = 0;

});

// Enter Key
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addBtn.click();
    }

});

// Initial Load
renderTask();