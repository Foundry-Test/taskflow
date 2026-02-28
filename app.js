const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput = document.getElementById('dueDateInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const completionCounter = document.getElementById('completionCounter');

const CATEGORIES = ['Work', 'Personal', 'Shopping'];

let tasks = [];
let activeFilter = 'All';

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

function updateCompletionCounter() {
  if (!completionCounter) return;
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  completionCounter.textContent = `${completed} / ${total} task${total !== 1 ? 's' : ''} completed`;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const progressBar = document.getElementById('completion-progress-bar');
  if (progressBar) {
    progressBar.style.width = percentage + '%';
    if (percentage === 100 && total > 0) {
      progressBar.style.backgroundColor = '#27ae60';
    } else {
      progressBar.style.backgroundColor = '#4a90e2';
    }
  }
}

function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = activeFilter === 'All'
    ? tasks
    : tasks.filter(task => task.category === activeFilter);

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = 'block';
    emptyMessage.textContent = tasks.length === 0
      ? 'No tasks yet. Add one above!'
      : `No tasks in "${activeFilter}" category.`;
  } else {
    emptyMessage.style.display = 'none';
  }

  filteredTasks.forEach((task) => {
    const index = tasks.indexOf(task);
    const overdue = isOverdue(task);

    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '') + (overdue ? ' overdue' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'task-checkbox';
    checkbox.setAttribute('aria-label', 'Mark task as complete');
    checkbox.addEventListener('change', () => toggleTask(index));

    const span = document.createElement('span');
    span.className = 'task-title';
    span.textContent = task.title;

    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag category-' + task.category.toLowerCase();
    categoryTag.textContent = task.category;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', () => deleteTask(index));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(categoryTag);

    if (task.dueDate) {
      const dueDateTag = document.createElement('span');
      dueDateTag.className = 'due-date-tag' + (overdue ? ' due-date-overdue' : '');
      const formattedDate = new Date(task.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      dueDateTag.textContent = (overdue ? '⚠️ Overdue: ' : '📅 Due: ') + formattedDate;
      li.appendChild(dueDateTag);
    }

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateCompletionCounter();
}

function addTask() {
  const title = taskInput.value.trim();
  if (!title) {
    taskInput.focus();
    taskInput.classList.add('shake');
    setTimeout(() => taskInput.classList.remove('shake'), 400);
    return;
  }

  const category = categorySelect ? categorySelect.value : 'Work';
  const dueDate = dueDateInput && dueDateInput.value ? dueDateInput.value : null;

  tasks.push({ title, completed: false, category, dueDate });
  taskInput.value = '';
  if (dueDateInput) dueDateInput.value = '';
  taskInput.focus();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderTasks();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setFilter(btn.getAttribute('data-filter'));
  });
});

renderTasks();