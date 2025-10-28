<?php
/**
 * Plugin Name: Notes App Data
 * Description: REST API for persisting notes app data to wp-content/uploads/notes-app/
 * Version: 1.0.0
 * Author: ProjectX
 */

if (!defined('ABSPATH')) {
    exit;
}

class NotesAppData {
    
    private $data_dir;
    private $data_file;
    private $data_filename = 'app-data.json';
    private $max_payload_size = 2097152; // 2 MB
    
    public function __construct() {
        // Get WordPress upload directory
        $upload_dir = wp_upload_dir();
        $this->data_dir = $upload_dir['basedir'] . '/notes-app';
        $this->data_file = $this->data_dir . '/' . $this->data_filename;
        
        // Register REST routes
        add_action('rest_api_init', array($this, 'register_routes'));
        
        // Create data directory if it doesn't exist
        add_action('init', array($this, 'ensure_data_directory'));
        
        // Add admin notice with paths
        add_action('admin_notices', array($this, 'show_paths_notice'));
    }
    
    /**
     * Ensure the data directory exists
     */
    public function ensure_data_directory() {
        if (!file_exists($this->data_dir)) {
            wp_mkdir_p($this->data_dir);
            
            // Add .htaccess to allow JSON file access
            $htaccess = $this->data_dir . '/.htaccess';
            if (!file_exists($htaccess)) {
                file_put_contents($htaccess, "<FilesMatch \"\\.json$\">\n    Order Allow,Deny\n    Allow from all\n</FilesMatch>");
            }
        }
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // GET /wp-json/notes-app/v1/data
        register_rest_route('notes-app/v1', '/data', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_data'),
            'permission_callback' => array($this, 'check_read_permission'),
        ));
        
        // PUT /wp-json/notes-app/v1/data
        register_rest_route('notes-app/v1', '/data', array(
            'methods' => 'PUT',
            'callback' => array($this, 'save_data'),
            'permission_callback' => array($this, 'check_write_permission'),
        ));
        
        // DELETE /wp-json/notes-app/v1/data
        register_rest_route('notes-app/v1', '/data', array(
            'methods' => 'DELETE',
            'callback' => array($this, 'delete_data'),
            'permission_callback' => array($this, 'check_write_permission'),
        ));
        
        // GET /wp-json/notes-app/v1/info - Returns paths and info
        register_rest_route('notes-app/v1', '/info', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_info'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Check if user can read data (logged in)
     */
    public function check_read_permission() {
        return is_user_logged_in();
    }
    
    /**
     * Check if user can write/delete data (edit_posts capability)
     */
    public function check_write_permission() {
        return current_user_can('edit_posts');
    }
    
    /**
     * GET endpoint - return current data
     */
    public function get_data($request) {
        if (!file_exists($this->data_file)) {
            // Return empty structure if file doesn't exist
            return new WP_REST_Response(array(
                'version' => 1,
                'updatedAt' => gmdate('c'),
                'notes' => array(),
                'todos' => array(),
                'settings' => new stdClass()
            ), 200);
        }
        
        $json_content = file_get_contents($this->data_file);
        $data = json_decode($json_content, true);
        
        if ($data === null) {
            return new WP_Error('invalid_json', 'Corrupted data file', array('status' => 500));
        }
        
        return new WP_REST_Response($data, 200);
    }
    
    /**
     * PUT endpoint - save data
     */
    public function save_data($request) {
        $body = $request->get_body();
        
        // Check payload size
        if (strlen($body) > $this->max_payload_size) {
            return new WP_Error('payload_too_large', 'Data exceeds 2 MB limit', array('status' => 413));
        }
        
        // Validate JSON
        $data = json_decode($body, true);
        if ($data === null) {
            return new WP_Error('invalid_json', 'Invalid JSON payload', array('status' => 400));
        }
        
        // Validate structure
        if (!isset($data['version']) || !isset($data['notes']) || !isset($data['todos'])) {
            return new WP_Error('invalid_structure', 'Missing required fields: version, notes, todos', array('status' => 400));
        }
        
        // Add/update timestamp
        $data['updatedAt'] = gmdate('c');
        
        // Ensure directory exists
        $this->ensure_data_directory();
        
        // Write to file
        $json_output = json_encode($data, JSON_PRETTY_PRINT);
        $result = file_put_contents($this->data_file, $json_output);
        
        if ($result === false) {
            return new WP_Error('write_failed', 'Failed to write data file', array('status' => 500));
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Data saved successfully',
            'updatedAt' => $data['updatedAt']
        ), 200);
    }
    
    /**
     * DELETE endpoint - clear data
     */
    public function delete_data($request) {
        if (file_exists($this->data_file)) {
            $result = unlink($this->data_file);
            
            if (!$result) {
                return new WP_Error('delete_failed', 'Failed to delete data file', array('status' => 500));
            }
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Data deleted successfully'
        ), 200);
    }
    
    /**
     * GET info endpoint - returns paths and configuration
     */
    public function get_info($request) {
        $upload_dir = wp_upload_dir();
        
        return new WP_REST_Response(array(
            'plugin_version' => '1.0.0',
            'absolute_path' => $this->data_file,
            'data_directory' => $this->data_dir,
            'public_url' => $upload_dir['baseurl'] . '/notes-app/' . $this->data_filename,
            'file_exists' => file_exists($this->data_file),
            'directory_writable' => is_writable($this->data_dir),
            'max_payload_size' => $this->max_payload_size,
            'endpoints' => array(
                'GET /wp-json/notes-app/v1/data',
                'PUT /wp-json/notes-app/v1/data',
                'DELETE /wp-json/notes-app/v1/data',
                'GET /wp-json/notes-app/v1/info'
            )
        ), 200);
    }
    
    /**
     * Show admin notice with paths
     */
    public function show_paths_notice() {
        $screen = get_current_screen();
        if ($screen && $screen->id === 'plugins') {
            $upload_dir = wp_upload_dir();
            ?>
            <div class="notice notice-info">
                <p><strong>Notes App Data Plugin Active</strong></p>
                <p><strong>Absolute Server Path:</strong> <code><?php echo esc_html($this->data_file); ?></code></p>
                <p><strong>Public URL:</strong> <code><?php echo esc_html($upload_dir['baseurl'] . '/notes-app/' . $this->data_filename); ?></code></p>
                <p><strong>REST Endpoints:</strong></p>
                <ul style="list-style: disc; margin-left: 20px;">
                    <li><code>GET <?php echo esc_url(rest_url('notes-app/v1/data')); ?></code></li>
                    <li><code>PUT <?php echo esc_url(rest_url('notes-app/v1/data')); ?></code></li>
                    <li><code>DELETE <?php echo esc_url(rest_url('notes-app/v1/data')); ?></code></li>
                    <li><code>GET <?php echo esc_url(rest_url('notes-app/v1/info')); ?></code></li>
                </ul>
            </div>
            <?php
        }
    }
}

// Initialize plugin
new NotesAppData();

// Console output for debugging (remove in production)
if (defined('WP_DEBUG') && WP_DEBUG) {
    add_action('init', function() {
        $upload_dir = wp_upload_dir();
        $data_file = $upload_dir['basedir'] . '/notes-app/app-data.json';
        error_log('=== Notes App Data Plugin ===');
        error_log('Absolute Path: ' . $data_file);
        error_log('Public URL: ' . $upload_dir['baseurl'] . '/notes-app/app-data.json');
        error_log('REST Base: ' . rest_url('notes-app/v1/'));
    });
}
