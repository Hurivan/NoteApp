# Notes App Data - WordPress Plugin

WordPress REST API plugin for persisting Notes App data to the server.

## Installation

1. Copy the `notes-app-data` folder to `wp-content/plugins/`
2. Activate the plugin in WordPress admin
3. The plugin will automatically create the data directory

## Storage Location

### Absolute Server Path
```
/srv/htdocs/wp-content/uploads/notes-app/app-data.json
```

### Public URL
```
https://yoursite.com/wp-content/uploads/notes-app/app-data.json
```

## REST API Endpoints

Base URL: `/wp-json/notes-app/v1/`

### 1. GET /data
Retrieves the current data.

**Authentication:** Requires logged-in user

**Example:**
```bash
curl -X GET "https://yoursite.com/wp-json/notes-app/v1/data" \
  -H "Cookie: wordpress_logged_in_xxx=..." \
  --cookie-jar cookies.txt
```

**Response (200 OK):**
```json
{
  "version": 1,
  "updatedAt": "2025-10-28T18:30:00Z",
  "notes": [],
  "todos": [],
  "settings": {}
}
```

### 2. PUT /data
Saves data to the server.

**Authentication:** Requires `edit_posts` capability + nonce

**Headers:**
- `Content-Type: application/json`
- `X-WP-Nonce: <nonce-value>`

**Example:**
```bash
curl -X PUT "https://yoursite.com/wp-json/notes-app/v1/data" \
  -H "Content-Type: application/json" \
  -H "X-WP-Nonce: abc123xyz" \
  -H "Cookie: wordpress_logged_in_xxx=..." \
  --cookie-jar cookies.txt \
  -d '{
    "version": 1,
    "notes": [...],
    "todos": [...],
    "settings": {}
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Data saved successfully",
  "updatedAt": "2025-10-28T18:30:00Z"
}
```

### 3. DELETE /data
Clears all data.

**Authentication:** Requires `edit_posts` capability + nonce

**Example:**
```bash
curl -X DELETE "https://yoursite.com/wp-json/notes-app/v1/data" \
  -H "X-WP-Nonce: abc123xyz" \
  -H "Cookie: wordpress_logged_in_xxx=..." \
  --cookie-jar cookies.txt
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Data deleted successfully"
}
```

### 4. GET /info
Returns plugin configuration and paths (no authentication required).

**Example:**
```bash
curl -X GET "https://yoursite.com/wp-json/notes-app/v1/info"
```

**Response:**
```json
{
  "plugin_version": "1.0.0",
  "absolute_path": "/srv/htdocs/wp-content/uploads/notes-app/app-data.json",
  "data_directory": "/srv/htdocs/wp-content/uploads/notes-app",
  "public_url": "https://yoursite.com/wp-content/uploads/notes-app/app-data.json",
  "file_exists": true,
  "directory_writable": true,
  "max_payload_size": 2097152,
  "endpoints": [...]
}
```

## WordPress Nonce

### How to Get the Nonce

Add this to your WordPress page/theme where the notes app is embedded:

```php
<script>
  window.wpApiSettings = {
    root: '<?php echo esc_url_raw(rest_url()); ?>',
    nonce: '<?php echo wp_create_nonce('wp_rest'); ?>'
  };
</script>
```

The nonce will be available in JavaScript as `window.wpApiSettings.nonce`.

### Using the Nonce in Frontend

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

## Data Structure

The plugin stores everything in a single JSON file:

```json
{
  "version": 1,
  "updatedAt": "2025-10-28T18:30:00Z",
  "notes": [
    {
      "id": "123",
      "title": "My Note",
      "content": "...",
      "category": "Work",
      "date": "2025-10-28",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "todos": [
    {
      "id": "456",
      "title": "My Todo",
      "description": "...",
      "category": "Personal",
      "status": "In Progress",
      "dueDate": "2025-11-15",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "settings": {}
}
```

## Security Features

1. **Authentication Required:** All endpoints require logged-in users
2. **Permission Checks:** Write/delete operations require `edit_posts` capability
3. **Nonce Validation:** WordPress automatically validates nonces on authenticated requests
4. **JSON Validation:** Invalid JSON payloads are rejected
5. **Size Limit:** Maximum payload size of 2 MB
6. **Directory Protection:** .htaccess allows only JSON file access

## Troubleshooting

### Check Plugin Status
Visit `/wp-json/notes-app/v1/info` to verify:
- File paths are correct
- Directory is writable
- Endpoints are registered

### Permission Errors
If you get 403 errors:
1. Make sure you're logged in to WordPress
2. Verify your user has `edit_posts` capability
3. Check that the nonce is correctly passed in headers

### File Write Errors
If data isn't saving:
1. Check directory permissions: `chmod 755 wp-content/uploads/notes-app/`
2. Check file permissions: `chmod 644 app-data.json`
3. Verify web server can write to uploads directory

## Files Created

- `/srv/htdocs/wp-content/uploads/notes-app/` - Data directory
- `/srv/htdocs/wp-content/uploads/notes-app/app-data.json` - Data file
- `/srv/htdocs/wp-content/uploads/notes-app/.htaccess` - Access control

## Summary

✅ **Absolute Server Path:** `/srv/htdocs/wp-content/uploads/notes-app/app-data.json`

✅ **Public URL:** `https://yoursite.com/wp-content/uploads/notes-app/app-data.json`

✅ **REST Endpoints:**
- `GET /wp-json/notes-app/v1/data`
- `PUT /wp-json/notes-app/v1/data`
- `DELETE /wp-json/notes-app/v1/data`
- `GET /wp-json/notes-app/v1/info`

✅ **Filename:** `app-data.json`
