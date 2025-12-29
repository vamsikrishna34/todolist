
document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const emptyMessage = document.getElementById('empty-message');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Initial render
  renderTasks();

  // Form submission
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-desc').value.trim();
    const dueDateInput = document.getElementById('task-due').value;

    // Simple validation
    if (!title) {
      showToast('⚠️ Task title is required.', 'warning');
      return;
    }

    const newTask = {
      id: Date.now(), // simple unique ID
      title,
      description,
      dueDate: dueDateInput || null,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Reset form
    taskForm.reset();
    document.getElementById('task-title').focus();
    showToast('Task added!', 'success');
  });

  // Render tasks
  function renderTasks() {
    if (tasks.length === 0) {
      taskList.innerHTML = '';
      emptyMessage.style.display = 'block';
      return;
    }

    emptyMessage.style.display = 'none';
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const dueDateFormatted = task.dueDate 
        ? new Date(task.dueDate).toLocaleDateString() 
        : '';

      const card = document.createElement('div');
      card.className = `card task-item ${task.completed ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1 me-2">
              <h6 class="task-title fw-bold mb-1">${escapeHtml(task.title)}</h6>
              ${task.description 
                ? `<p class="text-muted small mb-1">${escapeHtml(task.description)}</p>` 
                : ''}
              ${dueDateFormatted 
                ? `<small class="text-muted">
                    <i class="bi bi-calendar-event me-1"></i>${dueDateFormatted}
                  </small>` 
                : ''}
            </div>
            <div class="task-actions d-flex gap-1">
              <button class="btn btn-sm btn-outline-${task.completed ? 'success' : 'secondary'} toggle-complete"
                      data-id="${task.id}" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
                ${task.completed 
                  ? '<i class="bi bi-check-circle-fill text-success"></i>' 
                  : '<i class="bi bi-check-circle"></i>'}
              </button>
              <button class="btn btn-sm btn-outline-danger delete-task" data-id="${task.id}" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      taskList.appendChild(card);
    });

    // Rebind event listeners (since we replaced innerHTML)
    bindTaskEventListeners();
  }

  // Bind event listeners to dynamically added buttons
  function bindTaskEventListeners() {
    document.querySelectorAll('.toggle-complete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const task = tasks.find(t => t.id === id);
        if (task) {
          task.completed = !task.completed;
          saveTasks();
          renderTasks();
          showToast(task.completed ? '✓ Marked complete' : '↩ Marked incomplete', 'info');
        }
      });
    });

    document.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        showToast('🗑️ Task deleted.', 'danger');
      });
    });
  }

  // Save to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Simple toast using Bootstrap Toast (no extra markup needed)
  function showToast(message, type = 'info') {
    // Create toast container if not exists
    let toastContainer = document.getElementById('liveToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'liveToastContainer';
      toastContainer.style.position = 'fixed';
      toastContainer.style.bottom = '20px';
      toastContainer.style.right = '20px';
      toastContainer.style.zIndex = '1200';
      document.body.appendChild(toastContainer);
    }

    // Create toast
    const toastId = 'toast-' + Date.now();
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    toastEl.id = toastId;
    toastContainer.appendChild(toastEl);

    // Show toast
    const toast = new bootstrap.Toast(toastEl, {
      delay: 2500,
      animation: true
    });
    toast.show();

    // Auto-remove after hidden
    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  }

  // Simple XSS protection for display
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});