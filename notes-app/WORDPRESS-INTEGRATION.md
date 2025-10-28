# WordPress Integration Guide

## Setup Instructions

### 1. Install the WordPress Plugin

Copy the plugin folder to your WordPress installation:

```bash
cp -r notes-app-plugin/ /srv/htdocs/wp-content/plugins/notes-app-data/
```

Then activate the plugin in WordPress Admin → Plugins.

### 2. Add the Notes App to a WordPress Page

Create a new page in WordPress and add this HTML/PHP:

```html
<!-- Notes App Container -->
<div id="notes-app-container">
    <iframe 
        src="/wp-content/uploads/notes-app/index.html" 
        style="width: 100%; height: 800px; border: none;">
    </iframe>
</div>

<!-- WordPress Nonce for API -->
<script>
window.wpApiSettings = {
    root: '<?php echo esc_url_raw(rest_url()); ?>',
    nonce: '<?php echo wp_create_nonce('wp_rest'); ?>'
};
</script>
```

### 3. Upload the Notes App Files

Upload all notes app files to:
```
/srv/htdocs/wp-content/uploads/notes-app/
```

Files to upload:
- index.html
- notes.html
- demo.html
- styles.css
- todos.js
- notes.js
- scrapbook-editor.js
- wp-data-service.js
- README.md
- SCRAPBOOK-README.md

### 4. Verify Setup

Visit `/wp-json/notes-app/v1/info` to verify:
- Plugin is active
- Paths are correct
- Directory is writable

## Important Paths

### Absolute Server Path
```
/srv/htdocs/wp-content/uploads/notes-app/app-data.json
```

### Public URL
```
https://yoursite.com/wp-content/uploads/notes-app/app-data.json
```

### REST API Endpoints
```
GET    /wp-json/notes-app/v1/data
PUT    /wp-json/notes-app/v1/data
DELETE /wp-json/notes-app/v1/data
GET    /wp-json/notes-app/v1/info
```

## How It Works

### Data Flow

1. **Page Load:**
   - App calls `loadFromServer()`
   - GET request to `/wp-json/notes-app/v1/data`
   - Returns existing data or empty structure

2. **User Makes Changes:**
   - App updates in-memory data
   - Calls `debouncedSave()` (waits 1 second)
   - PUT request to `/wp-json/notes-app/v1/data` with nonce

3. **Export:**
   - User clicks "Export" button
   - Downloads JSON file locally

4. **Import:**
   - User clicks "Import" button
   - Selects JSON file
   - Confirms overwrite
   - PUT request saves to server

### Data Structure

```json
{
  "version": 1,
  "updatedAt": "2025-10-28T18:30:00Z",
  "notes": [
    {
      "id": "123",
      "title": "My Note",
      "category": "Work",
      "date": "2025-10-28",
      "description": "...",
      "content": "<p>...</p>",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "todos": [
    {
      "id": "456",
      "title": "My Todo",
      "category": "Personal",
      "subtitle": "...",
      "description": "<p>...</p>",
      "dueDate": "2025-11-15",
      "status": "In Progress",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "settings": {}
}
```

## Security

### Authentication
- All endpoints require WordPress login
- Write/delete operations require `edit_posts` capability

### Nonce Validation
The WordPress nonce must be passed in the `X-WP-Nonce` header:

```javascript
fetch('/wp-json/notes-app/v1/data', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': window.wpApiSettings.nonce
  },
  credentials: 'include',
  body: JSON.stringify(data)
});
```

### Size Limits
- Maximum payload: 2 MB
- Exceeding this will return a 413 error

## Troubleshooting

### "Nonce not found" Error
Make sure the WordPress nonce script is on the page:
```php
<script>
window.wpApiSettings = {
    root: '<?php echo esc_url_raw(rest_url()); ?>',
    nonce: '<?php echo wp_create_nonce('wp_rest'); ?>'
};
</script>
```

### "Permission denied" Error
- Make sure you're logged in to WordPress
- Verify your user has `edit_posts` capability
- Check if the nonce is valid (they expire after 24 hours)

### "Failed to save" Error
- Check directory permissions: `chmod 755 /srv/htdocs/wp-content/uploads/notes-app/`
- Check web server can write to the directory
- Check error logs: `tail -f /var/log/apache2/error.log`

### Data Not Loading
- Visit `/wp-json/notes-app/v1/info` to check plugin status
- Verify file exists at `/srv/htdocs/wp-content/uploads/notes-app/app-data.json`
- Check browser console for errors

## Testing with cURL

### Get Data
```bash
curl -X GET "https://yoursite.com/wp-json/notes-app/v1/data" \
  -H "Cookie: wordpress_logged_in_xxx=..." \
  --cookie-jar cookies.txt
```

### Save Data
```bash
curl -X PUT "https://yoursite.com/wp-json/notes-app/v1/data" \
  -H "Content-Type: application/json" \
  -H "X-WP-Nonce: abc123xyz" \
  -H "Cookie: wordpress_logged_in_xxx=..." \
  --cookie-jar cookies.txt \
  -d '{
    "version": 1,
    "notes": [],
    "todos": [],
    "settings": {}
  }'
```

### Get Info
```bash
curl -X GET "https://yoursite.com/wp-json/notes-app/v1/info"
```

## Summary

✅ **Plugin Location:** `/srv/htdocs/wp-content/plugins/notes-app-data/`

✅ **Data Storage Path:** `/srv/htdocs/wp-content/uploads/notes-app/app-data.json`

✅ **Public URL:** `https://yoursite.com/wp-content/uploads/notes-app/app-data.json`

✅ **REST Endpoints:**
- GET `/wp-json/notes-app/v1/data`
- PUT `/wp-json/notes-app/v1/data`
- DELETE `/wp-json/notes-app/v1/data`
- GET `/wp-json/notes-app/v1/info`

✅ **Filename:** `app-data.json`

✅ **Max File Size:** 2 MB

✅ **Authentication:** WordPress login + nonce required
