"use strict";
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["Pending"] = 0] = "Pending";
    TaskStatus[TaskStatus["Finished"] = 1] = "Finished";
})(TaskStatus || (TaskStatus = {}));
const validate = (item) => {
    const isValid = (item.min && item.text.length > item.min);
    return isValid;
};
class Task {
    constructor(id, description, status) {
        this.id = id;
        this.description = description;
        this.status = status;
    }
    statusToStr() {
        const status = this.status === 0 ? 'Pendente' : 'Finalizada';
        return status;
    }
}
class App {
    constructor() {
        this.tasks = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance;
    }
    printTasks() {
        document.querySelector('tbody').innerText = '';
        for (let task of this.tasks) {
            new TaskItem(task);
        }
    }
    addTask(id, description, status) {
        const task = new Task(id, description, status);
        this.tasks.push(task);
        this.printTasks();
    }
    set Tasks(tasks) {
        this.tasks = [...tasks];
        this.printTasks();
    }
    get Tasks() {
        return this.tasks;
    }
}
const app = App.getInstance();
class TaskItem {
    constructor(task) {
        this.task = task;
        this.task = task;
        this.template = document.querySelector('template');
        this.table_body = document.querySelector('tbody');
        this.table_row = this.table_body.insertRow(0);
        this.col_description = this.table_row.insertCell(0);
        this.col_status = this.table_row.insertCell(1);
        this.col_options = this.table_row.insertCell(2);
        this.col_description.innerHTML = this.task.description;
        this.col_status.innerHTML = this.task.statusToStr();
        this.col_options.innerHTML = this.template.innerHTML;
        this.btn_delete = this.col_options.querySelector('.del');
        this.btn_edit = this.col_options.querySelector('.edit');
        this.btn_finish = this.col_options.querySelector('.finish');
        this.setButtonStatus();
    }
    setButtonStatus() {
        this.col_options.setAttribute('justify-content', 'center');
        if (this.task.status === TaskStatus.Pending) {
            this.btn_delete.addEventListener('click', this.deleteClick.bind(this));
            this.btn_edit.addEventListener('click', this.editClick.bind(this));
            this.btn_finish.addEventListener('click', this.finishClick.bind(this));
        }
        else {
            this.btn_delete.disabled = true;
            this.btn_edit.disabled = true;
            this.btn_finish.disabled = true;
        }
    }
    removeTask(id, tasks) {
        const removedTask = tasks.filter((task) => task.id !== id);
        app.Tasks = removedTask;
    }
    taskEditing() {
        if (document.querySelector('input').value) {
            alert('Existe uma tarefa em edição');
            return true;
        }
        return false;
    }
    deleteClick() {
        if (!this.taskEditing()) {
            const id = this.task.id.toString();
            const tasks = [...app.Tasks];
            this.removeTask(id, tasks);
        }
    }
    editClick() {
        if (!this.taskEditing()) {
            const id = this.task.id.toString();
            const tasks = [...app.Tasks];
            const getText = tasks.find((task) => task.id === id);
            document.querySelector('input').value = getText.description;
            this.removeTask(id, tasks);
        }
    }
    finishClick() {
        if (!this.taskEditing()) {
            const id = this.task.id.toString();
            const tasks = [...app.Tasks];
            const task = tasks.find((task) => task.id === id);
            task.status = TaskStatus.Finished;
            app.Tasks = tasks;
        }
    }
}
class TaskForm {
    constructor() {
        this.taskInput = document.querySelector('input');
        this.submitButton = document.querySelector('.addTask');
        this.submit();
    }
    validation(value) {
        const checkInput = validate({
            text: value,
            min: 3,
        });
        if (!checkInput) {
            alert('Invalid input');
            return;
        }
        return value;
    }
    clearFormInput() {
        this.taskInput.value = '';
    }
    submitClick(e) {
        e.preventDefault();
        const getTaskValue = this.taskInput.value;
        const ValidatedText = this.validation(getTaskValue);
        if (ValidatedText) {
            const id = Math.random().toString();
            app.addTask(id, ValidatedText, TaskStatus.Pending);
            this.clearFormInput();
        }
        else {
            this.clearFormInput();
        }
    }
    submit() {
        console.log(this.submitButton, this.taskInput);
        this.submitButton.addEventListener('click', this.submitClick.bind(this));
    }
}
const taskForm = new TaskForm();
//# sourceMappingURL=app.js.map