const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const categorySelect = document.getElementById('category-select');
const filterButtons = document.querySelectorAll('.filter-btn');

const CATEGORIES = ['Work', 'Personal', 'Shopping'];

let tasks = [];
let activeFilter = 'All';

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

    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

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
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
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

  tasks.push({ title, completed: false, category });
  taskInput.value = '';
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