enum TaskStatus {
    Pending,
    Finished
}

interface Validation {
    text: string,
    min?: number;
}

const validate = (item: Validation) => {
    const isValid = (item.min && item.text.length > item.min);
    return isValid;
}

class Task {
    constructor(
        public id: string,
        public description: string,
        public status: TaskStatus
    ) { }

    public statusToStr() {
        const status = this.status === 0 ? 'Pendente' : 'Finalizada';
        return status;
    }
}

class App {
    protected tasks: Task[];
    private static instance: App;

    protected constructor() {
        this.tasks = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance;
    }

    protected printTasks() {
        document.querySelector('tbody')!.innerText = '';
        for (let task of this.tasks) {
            new TaskItem(task);
        }
    }

    public addTask(
        id: string,
        description: string,
        status: TaskStatus
    ) {
        const task = new Task(id, description, status);
        this.tasks.push(task);
        this.printTasks();
    }

    set Tasks(tasks: Task[]) {
        this.tasks = [...tasks];
        this.printTasks();
    }

    get Tasks() {
        return this.tasks;
    }
}

const app = App.getInstance();

class TaskItem {

    private template: HTMLTemplateElement;
    private table_body: HTMLTableSectionElement;
    private table_row: HTMLTableRowElement;
    private col_description: HTMLTableCellElement;
    private col_status: HTMLTableCellElement;
    private col_options: HTMLTableCellElement;
    private btn_delete: HTMLButtonElement;
    private btn_edit: HTMLButtonElement;
    private btn_finish: HTMLButtonElement;

    constructor(private task: Task) {
        this.task = task;
        this.template = document.querySelector('template')!;
        this.table_body = document.querySelector('tbody')! as HTMLTableSectionElement;
        this.table_row = this.table_body.insertRow(0);
        this.col_description = this.table_row.insertCell(0);
        this.col_status = this.table_row.insertCell(1);
        this.col_options = this.table_row.insertCell(2);
        this.col_description.innerHTML = this.task.description;
        this.col_status.innerHTML = this.task.statusToStr();
        this.col_options.innerHTML = this.template.innerHTML;
        this.btn_delete = this.col_options.querySelector('.del')! as HTMLButtonElement;
        this.btn_edit = this.col_options.querySelector('.edit')! as HTMLButtonElement;
        this.btn_finish = this.col_options.querySelector('.finish')! as HTMLButtonElement;
        this.setButtonStatus();
    }

    private setButtonStatus() {
        this.col_options.setAttribute('justify-content', 'center');
        if (this.task.status === TaskStatus.Pending) {
            this.btn_delete.addEventListener('click', this.deleteClick.bind(this));
            this.btn_edit.addEventListener('click', this.editClick.bind(this));
            this.btn_finish.addEventListener('click', this.finishClick.bind(this));
        } else {
            this.btn_delete.disabled = true;
            this.btn_edit.disabled = true;
            this.btn_finish.disabled = true;
        }
    }

    private removeTask(id: string, tasks: Task[]) {
        const removedTask = tasks.filter((task) => task.id !== id);
        app.Tasks = removedTask;
    }

    private taskEditing() {
        if (document.querySelector('input')!.value) {
            alert('Existe uma tarefa em edição');
            return true;
        }
        return false;
    }

    private deleteClick() {
        if (!this.taskEditing()) {
            const id = this.task.id.toString();
            const tasks = [...app.Tasks];
            this.removeTask(id, tasks);
        }
    }

    private editClick() {
        if (!this.taskEditing()) {
            const id = this.task.id.toString();
            const tasks = [...app.Tasks];
            const getText = tasks.find((task) => task.id === id)!;
            document.querySelector('input')!.value = getText.description;
            this.removeTask(id, tasks);
        }
    }

    private finishClick() {
        if (!this.taskEditing()) {
            const id = this.task.id.toString();
            const tasks = [...app.Tasks];
            const task = tasks.find((task) => task.id === id)!;
            task.status = TaskStatus.Finished;
            app.Tasks = tasks;
        }
    }

}

class TaskForm {
    taskInput: HTMLInputElement;
    submitButton: HTMLButtonElement;
    constructor() {
        this.taskInput = document.querySelector('input')! as HTMLInputElement;
        this.submitButton = document.querySelector('.addTask')! as HTMLButtonElement;
        this.submit();
    }

    private validation(value: string): string | undefined {
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

    private clearFormInput() {
        this.taskInput.value = '';
    }

    private submitClick(e: Event) {
        e.preventDefault();
        const getTaskValue = this.taskInput.value;
        const ValidatedText = this.validation(getTaskValue);
        if (ValidatedText) {
            const id = Math.random().toString();
            app.addTask(id, ValidatedText, TaskStatus.Pending);
            this.clearFormInput();
        } else {
            this.clearFormInput();
        }
    }

    private submit() {
        console.log(this.submitButton, this.taskInput);
        this.submitButton.addEventListener('click', this.submitClick.bind(this));
    }
}

const taskForm = new TaskForm();