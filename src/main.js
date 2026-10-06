"use strict";

import "./style.css";
import { state } from "./state";
import { format, parse } from "date-fns";
import {
  btnAddNewProject,
  btnAddNewTask,
  inputNewProject,
  inputNewTask,
  inputNewDateTask,
  newProjectFormEl,
  cancelNewProjectBtn,
  cancelNewTaskBtn,
  projectsListEl,
  tasksListEl,
  newTaskFormEl,
} from "./selectors";
let newProjectInputValue, newTaskInputValue, newTaskDateInputValue;
class TasksList {
  static el = "#tasks-list";

  static events = {
    "click #delete-task-btn": "deleteMethod",
    "click #edit-task-btn": "editMethod",
    "click #cancel-edit-task-btn": "cancelEditMethod",
    "click #checkbox": "checkboxMethod",
  };

  constructor() {
    this.setupEvents();
  }

  setupEvents() {
    tasksListEl.addEventListener("click", (e) => {
      for (const [key, methodName] of Object.entries(TasksList.events)) {
        const [eventName, selector] = key.split(" ");
        const id = e.target.closest("li").id;
        if (e.target.matches(selector)) {
          this[methodName](id);
          break;
        }
      }
    });
  }

  deleteMethod(id) {
    state.deleteTask(id);
    renderTasks();
  }
  editMethod(id) {
    state.setSelectedTaskId(id);
    renderTasks();
  }
  cancelEditMethod(id) {
    state.resetSelectTaskId(id);
    renderTasks();
  }
  checkboxMethod(id) {
    state.markTaskDone(id);
  }
}

// INPUT VALUES
inputNewProject.addEventListener("input", (e) => {
  newProjectInputValue = e.target.value;
});

inputNewTask.addEventListener("input", (e) => {
  newTaskInputValue = e.target.value;
});

inputNewDateTask.addEventListener("input", (e) => {
  newTaskDateInputValue = e.target.value;
});

// PROJECTS
btnAddNewProject.addEventListener("click", (e) => {
  hideShowInputs(e.target);
  inputNewProject.focus();
});

cancelNewProjectBtn.addEventListener("click", (e) => {
  hideShowInputs(e.target);
  newProjectFormEl.reset();
});

newProjectFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  state.addNewProject(newProjectInputValue);
  hideShowInputs(e.target);
  renderProjects();
  renderTasks();
  newProjectFormEl.reset();
});

projectsListEl.addEventListener("click", (e) => {
  const parent = e.target.closest("li");
  const id = parent.id;
  if (e.target.matches("i")) {
    state.deleteProject(id);
  } else {
    state.setSelectedProjectId(id);
  }
  renderProjects();
  renderTasks();
});

// TASKS
btnAddNewTask.addEventListener("click", (e) => {
  if (!state.getSelectedProjectId()) {
    return alert("Please select project folder!");
  }
  hideShowInputs(e.target);
  inputNewTask.focus();
});

cancelNewTaskBtn.addEventListener("click", (e) => {
  hideShowInputs(e.target);
  newTaskFormEl.reset();
});

newTaskFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  state.addNewTask(
    newTaskInputValue,
    format(newTaskDateInputValue, "dd/MM/yyyy"),
  );
  hideShowInputs(e.target);
  renderTasks();
  newTaskFormEl.reset();
});
new TasksList();

// EDIT TASK
tasksListEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const editValue = e.target.querySelector(".input-edit-task").value;
  const editDateValue = e.target.querySelector(".input-edit-date-task").value;
  state.editTask(editValue, format(editDateValue, "dd/MM/yyyy"));
  state.resetSelectTaskId();
  renderTasks();
  e.target.reset();
});

// RENDERING FUNCTIONS
function renderProjects() {
  projectsListEl.innerHTML = ``;
  [...state.getProjects()].reverse().forEach((project) => {
    projectsListEl.innerHTML += `
          <li class="projects-item ${setSelectedProjectClass(project.id)}" id="${project.id}">
            <p class="projects-name">${project.title}</p>
            <button class="delete-project-btn">
              <i class="fa-regular fa-circle-xmark delete-project-icon" data-id="delete-project"></i>
            </button>
          </li>
    `;
  });
}
function setSelectedProjectClass(id) {
  if (state.getSelectedProjectId() === id) {
    return "projects-selected";
  }
}
function renderTasks() {
  tasksListEl.innerHTML = ``;
  if (!state.getSelectedProject()) return;
  [...state.getTasks()].reverse().forEach((task) => {
    tasksListEl.innerHTML += `
          <li class="task-item" id="${task.id}">
            <div class="task-item-info ${setSelectedTaskClass(task.id)}">
              <p class="task-name">
                Title: <span class="task-span">${task.title}</span>
              </p>
              <div class="task-item-box">
                <p class="task-date">
                  Due date: <span class="task-span">${task.due}</span>
                </p>
                <div class="task-item-btns-box">
                  <button id="edit-task-btn" class="edit-task-btn btns-task">Edit</button>
                  <button id="delete-task-btn" class="delete-task-btn btns-task">Delete</button>
                </div>
                <input type="checkbox" class="checkbox" id="checkbox" ${checkTaskDone(task)}/>
              </div>
            </div>
            <form id="edit-form" class="new-edit-form">
            ${renderEditTask(task) || ""}
            </form>
          </li>
    `;
  });
}
function checkTaskDone(task) {
  if (task.isDone) {
    return "checked";
  } else {
    return "";
  }
}
function setSelectedTaskClass(id) {
  if (state.getSelectedTaskId() === id) {
    return "task-selected";
  }
}
function renderEditTask(task) {
  if (state.getSelectedTaskId() === "") return;
  if (task.id === state.getSelectedTaskId()) {
    return `
                <div class="task-inputs">
                  <div class="task-name-box">
                    <label for="new-task">Task: </label>
                    <input
                      type="text"
                      class="input input-new-task input-edit-task"
                      id="edit-task"
                      required
                      value="${task.title}"
                    />
                  </div>
                  <div class="task-date-box">
                    <label for="new-date">Due date: </label>
                    <input
                      type="date"
                      class="input input-new-task-date input-edit-date-task"
                      id="edit-date"
                      required
                      value="${format(parse(task.due, "dd/MM/yyyy", new Date()), "yyyy-MM-dd")}"
                    />
                  </div>
                </div>
                <div class="btns-flex-task">
                  <button
                    class="input-btns-task save-new-task-btn"
                    type="submit"
                  >
                    Save
                  </button>
                  <button
                    id="cancel-edit-task-btn"
                    class="input-btns-task cancel-edit-task-btn"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
  `;
  }
}
function hideShowInputs(target) {
  if (
    target.classList.contains("btn-new-project") ||
    target.classList.contains("cancel-new-project-btn") ||
    target === newProjectFormEl
  ) {
    newProjectFormEl.classList.toggle("hidden");
  } else if (
    target.classList.contains("btn-new-task") ||
    target.classList.contains("cancel-new-task-btn") ||
    target === newTaskFormEl
  ) {
    newTaskFormEl.classList.toggle("hidden");
  }
}
