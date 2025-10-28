// Todo App JavaScript

class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentSort = 'dueDate';
        this.editingId = null;
        
        this.init();
    }

    init() {
        this.renderTodos();
        this.attachEventListeners();
    }

    loadTodos() {
        const stored = localStorage.getItem('todos');
        return stored ? JSON.parse(stored) : [];
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    attachEventListeners() {
        // Add button
        document.getElementById('addTodoBtn').addEventListener('click', () => this.openModal());

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());

        // Modal backdrop click
        document.getElementById('todoModal').addEventListener('click', (e) => {
            if (e.target.id === 'todoModal') {
                this.closeModal();
            }
        });

        // Form submit
        document.getElementById('todoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTodo();
        });

        // Delete button
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteTodo());

        // Sort tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentSort = e.target.dataset.sort;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderTodos();
            });
        });

        // Rich text formatting
        document.querySelectorAll('.format-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = e.currentTarget.dataset.command;
                document.execCommand(command, false, null);
                document.getElementById('todoDescription').focus();
            });
        });

        // Insert link button
        document.getElementById('insertLinkBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const url = prompt('Enter URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
            document.getElementById('todoDescription').focus();
        });

        // Insert image button
        document.getElementById('insertImageBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const url = prompt('Enter image URL:');
            if (url) {
                document.execCommand('insertImage', false, url);
            }
            document.getElementById('todoDescription').focus();
        });
    }

    openModal(todo = null) {
        const modal = document.getElementById('todoModal');
        const form = document.getElementById('todoForm');
        const deleteBtn = document.getElementById('deleteBtn');
        const descEditor = document.getElementById('todoDescription');
        
        form.reset();
        descEditor.innerHTML = '';
        
        if (todo) {
            // Edit mode
            this.editingId = todo.id;
            document.getElementById('modalTitle').textContent = 'Edit To-Do';
            document.getElementById('todoId').value = todo.id;
            document.getElementById('todoTitle').value = todo.title;
            document.getElementById('todoCategory').value = todo.category || '';
            document.getElementById('todoSubtitle').value = todo.subtitle || '';
            descEditor.innerHTML = todo.description || '';
            document.getElementById('todoDueDate').value = todo.dueDate || '';
            document.getElementById('todoStatus').value = todo.status;
            deleteBtn.style.display = 'block';
        } else {
            // Create mode
            this.editingId = null;
            document.getElementById('modalTitle').textContent = 'Add To-Do';
            deleteBtn.style.display = 'none';
        }
        
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('todoModal').classList.remove('active');
        this.editingId = null;
    }

    saveTodo() {
        const title = document.getElementById('todoTitle').value.trim();
        const category = document.getElementById('todoCategory').value.trim();
        const subtitle = document.getElementById('todoSubtitle').value.trim();
        const description = document.getElementById('todoDescription').innerHTML;
        const dueDate = document.getElementById('todoDueDate').value;
        const status = document.getElementById('todoStatus').value;

        if (!title) return;

        if (this.editingId) {
            // Update existing todo
            const todo = this.todos.find(t => t.id === this.editingId);
            if (todo) {
                todo.title = title;
                todo.category = category;
                todo.subtitle = subtitle;
                todo.description = description;
                todo.dueDate = dueDate;
                todo.status = status;
                todo.updatedAt = new Date().toISOString();
            }
        } else {
            // Create new todo
            const newTodo = {
                id: Date.now().toString(),
                title,
                category,
                subtitle,
                description,
                dueDate,
                status,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.todos.push(newTodo);
        }

        this.saveTodos();
        this.renderTodos();
        this.closeModal();
    }

    deleteTodo() {
        if (!this.editingId) return;
        
        if (confirm('Are you sure you want to delete this to-do?')) {
            this.todos = this.todos.filter(t => t.id !== this.editingId);
            this.saveTodos();
            this.renderTodos();
            this.closeModal();
        }
    }

    sortTodos() {
        const sorted = [...this.todos];
        
        if (this.currentSort === 'dueDate') {
            sorted.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        } else if (this.currentSort === 'status') {
            const statusOrder = { 'To-Do': 1, 'In Progress': 2, 'Completed': 3 };
            sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        }
        
        return sorted;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    renderTodos() {
        const container = document.getElementById('todoList');
        const sorted = this.sortTodos();

        if (sorted.length === 0) {
            container.innerHTML = '<div class="empty-state">No to-dos yet. Click + to add one.</div>';
            return;
        }

        container.innerHTML = sorted.map(todo => `
            <div class="list-item" data-id="${todo.id}" onclick="app.openModal(app.todos.find(t => t.id === '${todo.id}'))">
                <div class="expand-icon">▸</div>
                <div class="item-content">
                    <div class="item-title">${this.escapeHtml(todo.title)}</div>
                    ${todo.category ? `<div class="item-category">${this.escapeHtml(todo.category)}</div>` : ''}
                    ${todo.subtitle ? `<div class="item-subtitle">${this.escapeHtml(todo.subtitle)}</div>` : ''}
                    ${todo.description ? `<div class="item-description">${todo.description}</div>` : ''}
                </div>
                <div class="item-meta">
                    ${todo.dueDate ? `<div class="item-date">${this.formatDate(todo.dueDate)}</div><span class="meta-divider">-</span>` : ''}
                    <div class="item-status">${todo.status}</div>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app
const app = new TodoApp();