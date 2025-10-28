# Scrapbook Editor - Apple Notes-Style Rich Content Input

A lightweight, pure JavaScript contenteditable component that mimics Apple Notes behavior. Supports drag & drop and paste of text, links, images, videos, and files without any toolbar.

## Features

### 🎯 Core Capabilities
- **Free-form typing** - Click anywhere and type naturally
- **Drag & drop support** - Images, videos, files, and links
- **Paste support** - Text, URLs, images, and HTML content
- **No toolbar needed** - Direct manipulation like Apple Notes
- **Type between items** - Seamlessly add text before, between, or after media blocks

### 📦 Supported Content Types

| Type | Format | Display |
|------|--------|---------|
| **Text** | Plain text | Inline text |
| **Links** | URLs | Card with favicon and URL |
| **Images** | JPG, PNG, GIF | Inline preview |
| **Videos** | MP4, MOV, WebM | Video player with controls |
| **Files** | PDF, DOC, etc. | Download link with file size |

## Usage

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="myEditor"></div>
    
    <script src="scrapbook-editor.js"></script>
    <script>
        const editor = new ScrapbookEditor('myEditor');
    </script>
</body>
</html>
```

### API

```javascript
// Initialize
const editor = new ScrapbookEditor('elementId');

// Get content (HTML)
const content = editor.getContent();

// Set content
editor.setContent('<p>Hello world</p>');

// Clear editor
editor.clear();
```

## How It Works

### 1. Drag & Drop

The editor listens for `dragover` and `drop` events on the contenteditable div:

```javascript
handleDrop(e) {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.items);
    
    // Process each dropped item
    for (const item of items) {
        if (item.kind === 'file') {
            const file = item.getAsFile();
            await this.insertFile(file);
        }
    }
}
```

### 2. Paste Detection

The `paste` event handler intelligently detects content type:

```javascript
handlePaste(e) {
    const clipboardData = e.clipboardData;
    
    // Check for files (images)
    if (clipboardData.files.length > 0) {
        // Insert as image cards
    }
    
    // Check if text is a URL
    const text = clipboardData.getData('text/plain');
    if (this.isUrl(text)) {
        // Insert as link card
    }
}
```

### 3. Content Cards

Each inserted item becomes a card with `contenteditable="false"`:

```javascript
createCard(type) {
    const card = document.createElement('div');
    card.className = `scrapbook-card scrapbook-card-${type}`;
    card.contentEditable = 'false';  // Prevent editing the card itself
    return card;
}
```

### 4. Caret Positioning

Uses the Selection API to insert content at the exact drop/paste location:

```javascript
insertCardAtCaret(card) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    range.insertNode(card);
    
    // Add line break after card for continued typing
    const br = document.createElement('br');
    card.parentNode.insertBefore(br, card.nextSibling);
}
```

## Styling

Cards use minimal hairline borders and subtle hover effects:

```css
.scrapbook-card {
    display: block;
    margin: 12px 0;
    padding: 12px;
    border: 1px solid #e0e0e0;
    background-color: #fafafa;
    border-radius: 4px;
}

.scrapbook-card:hover {
    border-color: #cccccc;
    background-color: #f5f5f5;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
```

## Integration Examples

### In a Form

```html
<form id="noteForm">
    <input type="text" id="title" placeholder="Title">
    <div id="content" class="scrapbook-editor"></div>
    <button type="submit">Save</button>
</form>

<script>
const editor = new ScrapbookEditor('content');

document.getElementById('noteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        content: editor.getContent()
    };
    // Save data
});
</script>
```

### With React (as external component)

```jsx
import { useEffect, useRef } from 'react';

function ScrapbookInput({ value, onChange }) {
    const editorRef = useRef(null);
    const instanceRef = useRef(null);
    
    useEffect(() => {
        if (editorRef.current && !instanceRef.current) {
            instanceRef.current = new ScrapbookEditor(editorRef.current.id);
            instanceRef.current.setContent(value || '');
            
            // Listen for changes
            editorRef.current.addEventListener('input', () => {
                onChange(instanceRef.current.getContent());
            });
        }
    }, []);
    
    return <div id="editor" ref={editorRef} />;
}
```

## Advanced Features

### Link Unfurling (Optional)

To show rich link previews with title, description, and images:

```javascript
async fetchLinkPreview(url, card) {
    try {
        const response = await fetch(`/api/unfurl?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        // Update card with metadata
        card.innerHTML = `
            <img src="${data.image}" alt="${data.title}">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
        `;
    } catch (error) {
        // Fallback to basic link display
    }
}
```

### Backend Unfurl Endpoint (Node.js)

```javascript
// server.js
app.get('/api/unfurl', async (req, res) => {
    const { url } = req.query;
    const metadata = await fetchOpenGraphData(url);
    res.json(metadata);
});
```

## Browser Support

- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ⚠️ IE11 (not supported)

## Security

All inserted text is automatically sanitized:

```javascript
escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;  // Automatic HTML escaping
    return div.innerHTML;
}
```

## Performance

- Lightweight: ~6KB minified
- No dependencies
- Uses native browser APIs
- Efficient DOM manipulation

## Known Limitations

1. **Link preview CORS**: Client-side unfurling blocked by CORS. Requires backend proxy.
2. **Large files**: File size limited by data URL conversion. Consider server upload for files >5MB.
3. **Mobile**: Drag & drop less intuitive on mobile. Paste and file input recommended.

## Roadmap

- [ ] Markdown export
- [ ] JSON serialization for storage
- [ ] Collaborative editing support
- [ ] Mobile-optimized UI
- [ ] Video thumbnail generation
- [ ] PDF preview rendering

## License

MIT License - Feel free to use in personal or commercial projects

## Credits

Inspired by Apple Notes, Notion, and other modern note-taking apps.
