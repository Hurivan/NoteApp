# Notes & To-Do App

A minimalist note-taking and to-do tracking application built with pure HTML, CSS, and JavaScript.

## Features

### To-Do List
- Add, edit, and delete to-do items
- Track status (To-Do, In Progress, Completed)
- Set due dates
- Add descriptions and tags
- Sort by due date or status
- Data persisted in localStorage

### Notecards
- Create and manage notecards
- Rich text editing (bold, italic, underline)
- Add dates and descriptions
- Sort by date or title
- Data persisted in localStorage

## Installation

1. Copy all files to your web server or WordPress directory
2. Ensure all files are in the same directory:
   - index.html (To-Do List)
   - notes.html (Notecards)
   - styles.css
   - todos.js
   - notes.js

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
- Use the formatting toolbar for rich text editing
- Use the tabs to sort by date or title
- All data is automatically saved to your browser's localStorage

## Fonts

The application uses Google Fonts:
- **Red Hat Display** - for headings and titles
- **Work Sans** - for body text and UI elements

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage
- contenteditable (for rich text editing)

## WordPress Hosting

To host on WordPress:
1. Upload all files to a subdirectory (e.g., `/notes-app/`)
2. Access via: `https://yoursite.com/notes-app/`
3. All paths are relative, so the app will work in any directory

## Data Storage

All data is stored locally in your browser using localStorage:
- To-dos are stored under the key `todos`
- Notes are stored under the key `notes`

Clearing browser data will delete all stored items.