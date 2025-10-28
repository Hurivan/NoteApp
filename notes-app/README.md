# Notes & To-Do App with Scrapbook Editor

A minimalist note-taking and to-do tracking application with an Apple Notes-style scrapbook editor built with pure HTML, CSS, and JavaScript.

## Features

### 📝 Two Main Pages

#### To-Do List
- Add, edit, and delete to-do items
- Track status (To-Do, In Progress, Completed)
- Set due dates and categories
- Rich scrapbook descriptions with drag & drop
- Sort by due date or status
- Data persisted in localStorage

#### Notecards
- Create and manage notecards
- Apple Notes-style scrapbook editor
- Drag & drop images, videos, links, and files
- Add dates and categories
- Sort by date or title
- Data persisted in localStorage

### 🎨 Scrapbook Editor (NEW!)

The revolutionary **Apple Notes-style editor** that supports:

- ✍️ **Free-form typing** - Click anywhere and type naturally
- 🖼️ **Drag & drop images** - From desktop or paste from clipboard
- 🎬 **Drag & drop videos** - MP4, MOV, WebM with built-in player
- 🔗 **Smart link cards** - Paste URLs to create preview cards
- 📎 **File attachments** - PDFs and other files as download links
- ⌨️ **Type between items** - Seamlessly add text around media

**No toolbar needed** - Just drag, drop, paste, and type!

## File Structure

```
/app/notes-app/
├── index.html              # To-Do List page
├── notes.html              # Notecards page
├── demo.html               # Scrapbook Editor demo
├── styles.css              # Global styles
├── todos.js                # To-Do logic
├── notes.js                # Notes logic
├── scrapbook-editor.js     # Scrapbook Editor component
├── README.md               # This file
└── SCRAPBOOK-README.md     # Detailed scrapbook documentation
```

## Installation

1. Copy all files to your web server or WordPress directory
2. Ensure all files are in the same directory
3. Open `index.html` in a web browser

## Usage

### To-Do List (index.html)
- Click the **+** button to add a new to-do
- Click on any row to edit that to-do
- Use the tabs to sort by due date or status
- All data is automatically saved to your browser's localStorage

### Notecards (notes.html)
- Click the **+** button to add a new notecard
- Click on any row to edit that notecard
- In the scrapbook editor:
  - Type naturally
  - Drag images, videos, or files from your desktop
  - Paste URLs to create link cards
  - Paste images from clipboard
- Use the tabs to sort by date or title

### Scrapbook Editor Demo (demo.html)
Open `demo.html` to see the scrapbook editor in action with test links and instructions.

## Design

- **Minimalist white background** with light gray hairlines (#e0e0e0)
- **ProjectX branding** in header (16pt medium weight)
- **Fixed-height rows** in list view with click-to-edit
- **Category badges** for organizing items
- **700px max width** for focused content
- **No shadows, no effects** - pure minimalism

## Fonts

The application uses Google Fonts:
- **Red Hat Display** - for headings and titles
- **Work Sans** - for body text and UI elements

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage
- contenteditable
- FileReader API
- Drag & Drop API

## Data Storage

All data is stored locally in your browser using localStorage:
- To-dos are stored under the key `todos`
- Notes are stored under the key `notes`

**Note:** Clearing browser data will delete all stored items.

## WordPress Hosting

To host on WordPress:
1. Upload all files to a subdirectory (e.g., `/notes-app/`)
2. Access via: `https://yoursite.com/notes-app/`
3. All paths are relative, so the app will work in any directory

## Scrapbook Editor API

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

For detailed documentation, see [SCRAPBOOK-README.md](SCRAPBOOK-README.md)

## What Makes This Special

### 🎯 No Toolbar Needed
Unlike traditional rich text editors, the scrapbook editor requires **zero UI controls**. Just drag, drop, paste, and type - exactly like Apple Notes.

### 📦 Content Cards
Every inserted item (image, video, link, file) becomes a beautiful card with:
- Light gray hairline borders
- Subtle hover effects
- Proper spacing for typing between items

### 🔄 Smart Detection
The editor automatically detects:
- URLs and creates link cards with favicons
- Image files and displays inline previews
- Video files and adds playback controls
- Other files and creates download links

## Advanced Features

### Link Unfurling (Ready for Backend)
The editor includes placeholders for rich link previews. To enable:

1. Create a backend endpoint: `/api/unfurl?url=`
2. Return Open Graph metadata (title, description, image)
3. The editor will automatically display rich previews

See [SCRAPBOOK-README.md](SCRAPBOOK-README.md) for implementation details.

## Roadmap

- [x] Basic note-taking and todo tracking
- [x] Category field support
- [x] Scrapbook editor with drag & drop
- [ ] Link unfurling with backend
- [ ] Markdown export
- [ ] JSON serialization
- [ ] Collaborative editing
- [ ] Mobile-optimized UI

## License

MIT License - Feel free to use in personal or commercial projects