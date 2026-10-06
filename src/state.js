function createProject(value) {
  const project = {
    id: crypto.randomUUID(),
    title: value,
    tasks: [],
    selectedTaskId: "",

    getId() {
      return this.id;
    },

    addNewTask(value, date) {
      const task = {
        id: crypto.randomUUID(),
        title: value,
        due: date,
        isDone: false,
      };
      this.tasks.push(task);
    },

    editTask(value, date) {
      const task = this.tasks.find((task) => task.id === this.selectedTaskId);
      task.title = value;
      task.due = date;
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      if (this.selectedTaskId === id) this.selectedTaskId = "";
    },

    setSelectedTaskId(id) {
      this.selectedTaskId = id;
    },

    resetSelectTaskId() {
      this.selectedTaskId = "";
    },

    markTaskDone(id) {
      const task = this.tasks.find((task) => task.id === id);
      task.isDone = !task.isDone;
    },

    getTasks() {
      return this.tasks;
    },

    getSelectedTaskId() {
      return this.selectedTaskId;
    },
  };
  return project;
}
export const state = {
  projects: [],
  selectedProjectId: "",

  addNewProject(value) {
    const newProject = createProject(value);
    this.selectedProjectId = newProject.id;
    this.projects.push(newProject);
  },

  deleteProject(id) {
    this.projects = this.projects.filter((project) => project.id !== id);
    if (this.selectedProjectId === id) this.selectedProjectId = "";
  },

  getProjects() {
    return this.projects;
  },

  setSelectedProjectId(id) {
    this.selectedProjectId = id;
  },

  resetSelectedProjectId() {
    this.selectedProjectId = "";
  },

  getSelectedProjectId() {
    return this.selectedProjectId;
  },

  getSelectedProject() {
    return this.projects.find(
      (project) => project.getId() === this.selectedProjectId,
    );
  },

  addNewTask(value, date) {
    this.getSelectedProject().addNewTask(value, date);
  },

  editTask(value, date) {
    this.getSelectedProject().editTask(value, date);
  },

  deleteTask(id) {
    this.getSelectedProject().deleteTask(id);
  },

  getTasks() {
    return this.getSelectedProject().getTasks();
  },

  markTaskDone(id) {
    this.getSelectedProject().markTaskDone(id);
  },

  setSelectedTaskId(id) {
    this.getSelectedProject().setSelectedTaskId(id);
  },

  resetSelectTaskId() {
    this.getSelectedProject().resetSelectTaskId();
  },

  getSelectedTaskId() {
    return this.getSelectedProject().getSelectedTaskId();
  },
};
