// Notes App JavaScript

class NotesApp {
    constructor() {
        this.notes = this.loadNotes();
        this.currentSort = 'date';
        this.editingId = null;
        this.scrapbookEditor = null;
        
        this.init();
    }

    init() {
        this.renderNotes();
        this.attachEventListeners();
    }

    loadNotes() {
        const stored = localStorage.getItem('notes');
        return stored ? JSON.parse(stored) : [];
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    attachEventListeners() {
        // Add button
        document.getElementById('addNoteBtn').addEventListener('click', () => this.openModal());

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());

        // Modal backdrop click
        document.getElementById('noteModal').addEventListener('click', (e) => {
            if (e.target.id === 'noteModal') {
                this.closeModal();
            }
        });

        // Form submit
        document.getElementById('noteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNote();
        });

        // Delete button
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteNote());

        // Sort tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentSort = e.target.dataset.sort;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderNotes();
            });
        });

        // Rich text formatting
        document.querySelectorAll('.format-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = e.currentTarget.dataset.command;
                document.execCommand(command, false, null);
                document.getElementById('noteContent').focus();
            });
        });

        // Insert link button
        document.getElementById('insertLinkBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const url = prompt('Enter URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
            document.getElementById('noteContent').focus();
        });

        // Insert image button
        document.getElementById('insertImageBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const url = prompt('Enter image URL:');
            if (url) {
                document.execCommand('insertImage', false, url);
            }
            document.getElementById('noteContent').focus();
        });
    }

    openModal(note = null) {
        const modal = document.getElementById('noteModal');
        const form = document.getElementById('noteForm');
        const deleteBtn = document.getElementById('deleteBtn');
        const contentEditor = document.getElementById('noteContent');
        
        form.reset();
        contentEditor.innerHTML = '';
        
        if (note) {
            // Edit mode
            this.editingId = note.id;
            document.getElementById('modalTitle').textContent = 'Edit Notecard';
            document.getElementById('noteId').value = note.id;
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteCategory').value = note.category || '';
            document.getElementById('noteDate').value = note.date;
            document.getElementById('noteDescription').value = note.description || '';
            contentEditor.innerHTML = note.content || '';
            deleteBtn.style.display = 'block';
        } else {
            // Create mode
            this.editingId = null;
            document.getElementById('modalTitle').textContent = 'Add Notecard';
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('noteDate').value = today;
            deleteBtn.style.display = 'none';
        }
        
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('noteModal').classList.remove('active');
        this.editingId = null;
    }

    saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const category = document.getElementById('noteCategory').value.trim();
        const date = document.getElementById('noteDate').value;
        const description = document.getElementById('noteDescription').value.trim();
        const content = document.getElementById('noteContent').innerHTML;

        if (!title || !date) return;

        if (this.editingId) {
            // Update existing note
            const note = this.notes.find(n => n.id === this.editingId);
            if (note) {
                note.title = title;
                note.category = category;
                note.date = date;
                note.description = description;
                note.content = content;
                note.updatedAt = new Date().toISOString();
            }
        } else {
            // Create new note
            const newNote = {
                id: Date.now().toString(),
                title,
                category,
                date,
                description,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.notes.push(newNote);
        }

        this.saveNotes();
        this.renderNotes();
        this.closeModal();
    }

    deleteNote() {
        if (!this.editingId) return;
        
        if (confirm('Are you sure you want to delete this notecard?')) {
            this.notes = this.notes.filter(n => n.id !== this.editingId);
            this.saveNotes();
            this.renderNotes();
            this.closeModal();
        }
    }

    sortNotes() {
        const sorted = [...this.notes];
        
        if (this.currentSort === 'date') {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (this.currentSort === 'title') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        }
        
        return sorted;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    renderNotes() {
        const container = document.getElementById('noteList');
        const sorted = this.sortNotes();

        if (sorted.length === 0) {
            container.innerHTML = '<div class="empty-state">No notecards yet. Click + to add one.</div>';
            return;
        }

        container.innerHTML = sorted.map(note => {
            const contentPreview = this.stripHtml(note.content).substring(0, 100);
            return `
                <div class="list-item" data-id="${note.id}" onclick="notesApp.openModal(notesApp.notes.find(n => n.id === '${note.id}'))">
                    <div class="expand-icon">▸</div>
                    <div class="item-content">
                        <div class="item-title">${this.escapeHtml(note.title)}</div>
                        ${note.category ? `<div class="item-category">${this.escapeHtml(note.category)}</div>` : ''}
                        ${note.description ? `<div class="item-subtitle">${this.escapeHtml(note.description)}</div>` : ''}
                        ${contentPreview ? `<div class="item-description">${this.escapeHtml(contentPreview)}${note.content.length > 100 ? '...' : ''}</div>` : ''}
                    </div>
                    <div class="item-meta">
                        <div class="item-date">${this.formatDate(note.date)}</div>
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
}

// Initialize app
const notesApp = new NotesApp();