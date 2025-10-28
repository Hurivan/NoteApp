/**
 * Scrapbook Editor - Apple Notes-style contenteditable area
 * Supports drag-drop and paste of text, links, images, videos, and files
 */

class ScrapbookEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        
        this.setupEditor();
        this.attachEventListeners();
    }

    setupEditor() {
        this.container.setAttribute('contenteditable', 'true');
        this.container.classList.add('scrapbook-editor');
        
        // Set placeholder behavior
        if (this.container.innerHTML.trim() === '') {
            this.container.innerHTML = '<p><br></p>';
        }
    }

    attachEventListeners() {
        // Drag and drop
        this.container.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.container.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Paste
        this.container.addEventListener('paste', (e) => this.handlePaste(e));
        
        // Prevent default drag behavior on document
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }

    async handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const items = Array.from(e.dataTransfer.items || []);
        const files = Array.from(e.dataTransfer.files || []);
        
        // Set caret position where drop occurred
        this.setCaretAtPoint(e.clientX, e.clientY);
        
        // Process items
        for (const item of items) {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                await this.insertFile(file);
            } else if (item.kind === 'string' && item.type === 'text/plain') {
                item.getAsString((text) => {
                    this.insertContent(text);
                });
            } else if (item.kind === 'string' && item.type === 'text/uri-list') {
                item.getAsString((url) => {
                    this.insertLink(url.trim());
                });
            }
        }
        
        // Fallback to files if no items
        if (items.length === 0 && files.length > 0) {
            for (const file of files) {
                await this.insertFile(file);
            }
        }
    }

    async handlePaste(e) {
        const clipboardData = e.clipboardData;
        
        // Check for files first
        const files = Array.from(clipboardData.files || []);
        if (files.length > 0) {
            e.preventDefault();
            for (const file of files) {
                await this.insertFile(file);
            }
            return;
        }
        
        // Check for HTML content
        const html = clipboardData.getData('text/html');
        if (html) {
            // Check if it contains images
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const imgs = tempDiv.querySelectorAll('img');
            
            if (imgs.length > 0) {
                e.preventDefault();
                for (const img of imgs) {
                    if (img.src) {
                        this.insertImageFromUrl(img.src);
                    }
                }
                return;
            }
        }
        
        // Check for plain text that might be a URL
        const text = clipboardData.getData('text/plain');
        if (text && this.isUrl(text.trim())) {
            e.preventDefault();
            this.insertLink(text.trim());
            return;
        }
        
        // Let default paste behavior handle regular text
    }

    setCaretAtPoint(x, y) {
        let range;
        if (document.caretPositionFromPoint) {
            const position = document.caretPositionFromPoint(x, y);
            range = document.createRange();
            range.setStart(position.offsetNode, position.offset);
        } else if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(x, y);
        }
        
        if (range) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    insertContent(content) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const textNode = document.createTextNode(content);
        range.insertNode(textNode);
        
        // Move caret to end of inserted text
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    async insertFile(file) {
        const type = file.type;
        
        if (type.startsWith('image/')) {
            await this.insertImage(file);
        } else if (type.startsWith('video/')) {
            await this.insertVideo(file);
        } else {
            this.insertFileDownload(file);
        }
    }

    async insertImage(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.insertImageFromUrl(e.target.result, file.name);
        };
        
        reader.readAsDataURL(file);
    }

    insertImageFromUrl(url, alt = 'Image') {
        const card = this.createCard('image');
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = alt;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        
        card.appendChild(img);
        this.insertCardAtCaret(card);
    }

    async insertVideo(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.insertVideoFromUrl(e.target.result);
        };
        
        reader.readAsDataURL(file);
    }

    insertVideoFromUrl(url) {
        const card = this.createCard('video');
        
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.height = 'auto';
        video.style.display = 'block';
        
        card.appendChild(video);
        this.insertCardAtCaret(card);
    }

    insertFileDownload(file) {
        const card = this.createCard('file');
        
        const icon = document.createElement('span');
        icon.textContent = '📎';
        icon.style.marginRight = '8px';
        icon.style.fontSize = '20px';
        
        const link = document.createElement('a');
        link.textContent = file.name;
        link.href = '#';
        link.style.textDecoration = 'none';
        link.style.color = '#0066cc';
        
        const size = document.createElement('span');
        size.textContent = ` (${this.formatFileSize(file.size)})`;
        size.style.color = '#999999';
        size.style.fontSize = '13px';
        size.style.marginLeft = '5px';
        
        card.appendChild(icon);
        card.appendChild(link);
        card.appendChild(size);
        
        // Create download link
        const reader = new FileReader();
        reader.onload = (e) => {
            link.href = e.target.result;
            link.download = file.name;
        };
        reader.readAsDataURL(file);
        
        this.insertCardAtCaret(card);
    }

    async insertLink(url) {
        const card = this.createCard('link');
        
        // Create basic link card
        const linkContainer = document.createElement('div');
        linkContainer.style.display = 'flex';
        linkContainer.style.alignItems = 'center';
        linkContainer.style.gap = '10px';
        
        // Favicon
        const favicon = document.createElement('img');
        favicon.src = this.getFaviconUrl(url);
        favicon.style.width = '16px';
        favicon.style.height = '16px';
        favicon.onerror = () => {
            favicon.style.display = 'none';
        };
        
        // Link text
        const linkText = document.createElement('a');
        linkText.href = url;
        linkText.textContent = url;
        linkText.target = '_blank';
        linkText.rel = 'noopener noreferrer';
        linkText.style.color = '#0066cc';
        linkText.style.textDecoration = 'none';
        linkText.style.flex = '1';
        linkText.style.overflow = 'hidden';
        linkText.style.textOverflow = 'ellipsis';
        linkText.style.whiteSpace = 'nowrap';
        
        linkContainer.appendChild(favicon);
        linkContainer.appendChild(linkText);
        card.appendChild(linkContainer);
        
        this.insertCardAtCaret(card);
        
        // Try to fetch metadata (optional enhancement)
        this.fetchLinkPreview(url, card);
    }

    async fetchLinkPreview(url, card) {
        // Optional: Call unfurl API to get link metadata
        // For now, we'll just use the basic link display
        // In production, you would call: fetch(`/api/unfurl?url=${encodeURIComponent(url)}`)
    }

    createCard(type) {
        const card = document.createElement('div');
        card.className = `scrapbook-card scrapbook-card-${type}`;
        card.contentEditable = 'false';
        return card;
    }

    insertCardAtCaret(card) {
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            this.container.appendChild(card);
            return;
        }
        
        const range = selection.getRangeAt(0);
        
        // Insert card
        range.insertNode(card);
        
        // Add line break after card for typing
        const br = document.createElement('br');
        card.parentNode.insertBefore(br, card.nextSibling);
        
        // Move caret after the card
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    isUrl(text) {
        try {
            const url = new URL(text);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    }

    getFaviconUrl(url) {
        try {
            const urlObj = new URL(url);
            return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
        } catch {
            return '';
        }
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    getContent() {
        return this.container.innerHTML;
    }

    setContent(html) {
        this.container.innerHTML = html;
    }

    clear() {
        this.container.innerHTML = '<p><br></p>';
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrapbookEditor;
}
