// Todo App JavaScript with WordPress Integration

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentSort = 'dueDate';
        this.editingId = null;
        this.scrapbookEditor = null;
        this.dataService = new WordPressDataService();
        
        this.init();
    }

    async init() {
        // Load data from server
        await this.loadFromServer();
        this.renderTodos();
        this.attachEventListeners();
        this.attachToolsListeners();
    }

    async loadFromServer() {
        const data = await this.dataService.loadFromServer();
        this.todos = data.todos || [];
    }

    saveTodos() {
        // Debounced save to server
        const data = {
            todos: this.todos,
            notes: window.notesAppData?.notes || []
        };
        this.dataService.debouncedSave(data);
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
    }

    openModal(todo = null) {
        const modal = document.getElementById('todoModal');
        const form = document.getElementById('todoForm');
        const deleteBtn = document.getElementById('deleteBtn');
        
        form.reset();
        
        // Initialize scrapbook editor if not already done
        if (!this.scrapbookEditor) {
            this.scrapbookEditor = new ScrapbookEditor('todoDescription');
        }
        
        this.scrapbookEditor.clear();
        
        if (todo) {
            // Edit mode
            this.editingId = todo.id;
            document.getElementById('modalTitle').textContent = 'Edit To-Do';
            document.getElementById('todoId').value = todo.id;
            document.getElementById('todoTitle').value = todo.title;
            document.getElementById('todoCategory').value = todo.category || '';
            document.getElementById('todoSubtitle').value = todo.subtitle || '';
            this.scrapbookEditor.setContent(todo.description || '');
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
        const description = this.scrapbookEditor.getContent();
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

        container.innerHTML = sorted.map(todo => {
            const descriptionPreview = todo.description ? this.stripHtml(todo.description).split('\n').slice(0, 2).join(' ') : '';
            return `
                <div class="list-item" data-id="${todo.id}" onclick="app.openModal(app.todos.find(t => t.id === '${todo.id}'))">
                    <div class="expand-icon">▸</div>
                    <div class="item-content">
                        <div class="item-title">${this.escapeHtml(todo.title)}</div>
                        ${todo.category ? `<div class="item-category">${this.escapeHtml(todo.category)}</div>` : ''}
                        ${todo.subtitle ? `<div class="item-subtitle">${this.escapeHtml(todo.subtitle)}</div>` : ''}
                        ${descriptionPreview ? `<div class="item-notecontent">${this.escapeHtml(descriptionPreview)}</div>` : ''}
                    </div>
                    <div class="item-meta">
                        ${todo.dueDate ? `<div class="item-date">${this.formatDate(todo.dueDate)}</div><span class="meta-divider">-</span>` : ''}
                        <div class="item-status">${todo.status}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    attachToolsListeners() {
        // Export button
        document.getElementById('exportBtn')?.addEventListener('click', () => {
            const data = {
                todos: this.todos,
                notes: window.notesAppData?.notes || []
            };
            this.dataService.exportData(data);
        });

        // Import button
        document.getElementById('importBtn')?.addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        // Import file input
        document.getElementById('importFile')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const data = await this.dataService.importData(file);
                    this.todos = data.todos || [];
                    this.renderTodos();
                    
                    // Notify other page to reload
                    window.notesAppData = data;
                } catch (error) {
                    console.error('Import failed:', error);
                }
                e.target.value = ''; // Reset file input
            }
        });
    }
}

// Initialize app and make it globally accessible
const app = new TodoApp();
window.notesAppData = window.notesAppData || { todos: app.todos, notes: [] };