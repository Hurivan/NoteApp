/**
 * WordPress Data Service
 * Handles server persistence for notes app data
 */

class WordPressDataService {
    constructor() {
        this.apiBase = '/wp-json/notes-app/v1';
        this.saveTimeout = null;
        this.saveDelay = 1000; // 1 second debounce
        this.isSaving = false;
        this.lastSaveTime = null;
        
        // Get WP nonce from page (must be set by WordPress)
        this.nonce = window.wpApiSettings?.nonce || '';
        
        // Fallback to localStorage if server fails
        this.useLocalStorage = false;
    }

    /**
     * Load data from server
     */
    async loadFromServer() {
        try {
            const response = await fetch(`${this.apiBase}/data`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                // No data yet, return empty structure
                return this.getEmptyData();
            }

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            
            // Cache in localStorage as backup
            this.cacheLocally(data);
            
            return data;
        } catch (error) {
            console.warn('Failed to load from server, using localStorage:', error);
            this.useLocalStorage = true;
            return this.loadFromLocalStorage();
        }
    }

    /**
     * Save data to server (immediate)
     */
    async saveToServer(data) {
        if (!this.nonce) {
            console.error('WordPress nonce not found. Cannot save to server.');
            this.saveToLocalStorage(data);
            return false;
        }

        this.isSaving = true;
        this.showStatus('Saving...');

        try {
            const payload = {
                version: 1,
                updatedAt: new Date().toISOString(),
                notes: data.notes || [],
                todos: data.todos || [],
                settings: data.settings || {}
            };

            const response = await fetch(`${this.apiBase}/data`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': this.nonce
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Server returned ${response.status}`);
            }

            const result = await response.json();
            this.lastSaveTime = new Date();
            
            // Also cache locally
            this.cacheLocally(payload);
            
            this.showStatus('Saved', 'success');
            this.isSaving = false;
            
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            this.showStatus('Save failed', 'error');
            this.isSaving = false;
            
            // Fallback to localStorage
            this.saveToLocalStorage(data);
            return false;
        }
    }

    /**
     * Debounced save - waits for inactivity before saving
     */
    debouncedSave(data) {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = setTimeout(() => {
            this.saveToServer(data);
        }, this.saveDelay);
    }

    /**
     * Delete data from server
     */
    async deleteFromServer() {
        if (!this.nonce) {
            console.error('WordPress nonce not found.');
            return false;
        }

        try {
            const response = await fetch(`${this.apiBase}/data`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-WP-Nonce': this.nonce
                }
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            localStorage.removeItem('notes-app-cache');
            this.showStatus('Data cleared', 'success');
            return true;
        } catch (error) {
            console.error('Delete failed:', error);
            this.showStatus('Delete failed', 'error');
            return false;
        }
    }

    /**
     * Export data to JSON file
     */
    exportData(data) {
        const payload = {
            version: 1,
            exportedAt: new Date().toISOString(),
            notes: data.notes || [],
            todos: data.todos || [],
            settings: data.settings || {}
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const date = new Date().toISOString().split('T')[0];
        a.download = `notes-app-data-${date}.json`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showStatus('Data exported', 'success');
    }

    /**
     * Import data from JSON file
     */
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    // Validate structure
                    if (!data.notes || !data.todos) {
                        throw new Error('Invalid data structure');
                    }

                    // Confirm overwrite
                    const confirmed = confirm(
                        'This will replace all current data. Continue?'
                    );

                    if (!confirmed) {
                        reject('Import cancelled');
                        return;
                    }

                    // Save to server
                    const success = await this.saveToServer(data);
                    
                    if (success) {
                        this.showStatus('Data imported', 'success');
                        resolve(data);
                    } else {
                        throw new Error('Failed to save imported data');
                    }
                } catch (error) {
                    this.showStatus('Import failed: ' + error.message, 'error');
                    reject(error);
                }
            };

            reader.onerror = () => {
                this.showStatus('Failed to read file', 'error');
                reject(new Error('File read error'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Get empty data structure
     */
    getEmptyData() {
        return {
            version: 1,
            updatedAt: new Date().toISOString(),
            notes: [],
            todos: [],
            settings: {}
        };
    }

    /**
     * LocalStorage fallback methods
     */
    cacheLocally(data) {
        try {
            localStorage.setItem('notes-app-cache', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to cache data locally:', e);
        }
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('notes-app-cache');
        return stored ? JSON.parse(stored) : this.getEmptyData();
    }

    saveToLocalStorage(data) {
        try {
            const payload = {
                version: 1,
                updatedAt: new Date().toISOString(),
                notes: data.notes || [],
                todos: data.todos || [],
                settings: data.settings || {}
            };
            localStorage.setItem('notes-app-cache', JSON.stringify(payload));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    /**
     * Show status toast
     */
    showStatus(message, type = 'info') {
        // Remove existing toast
        const existing = document.querySelector('.notes-app-toast');
        if (existing) {
            existing.remove();
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = `notes-app-toast notes-app-toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Get server info
     */
    async getServerInfo() {
        try {
            const response = await fetch(`${this.apiBase}/info`);
            return await response.json();
        } catch (error) {
            console.error('Failed to get server info:', error);
            return null;
        }
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordPressDataService;
}
