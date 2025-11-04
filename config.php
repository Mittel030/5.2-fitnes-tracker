<?php
define('DB_HOST', '192.168.1.50');
define('DB_USER', 'fittrack_user');  // Nieuwe gebruikersnaam voor het project
define('DB_PASS', 'fittrack2025');    // Nieuw wachtwoord voor het project
define('DB_NAME', 'fittrack');

// Allow per-developer overrides in config.local.php (this file should
// NOT be committed). Example of config.local.php is provided as
// `config.local.php.example` in the repo.
if (file_exists(__DIR__ . '/config.local.php')) {
    // config.local.php can define DB_HOST, DB_USER, DB_PASS and DB_NAME
    include __DIR__ . '/config.local.php';
} else {
    // Allow environment variables to override defaults when available
    $env = getenv('DB_HOST');
    if ($env !== false && $env !== '') { define('DB_HOST', $env); }
    $env = getenv('DB_USER');
    if ($env !== false && $env !== '') { define('DB_USER', $env); }
    $env = getenv('DB_PASS');
    if ($env !== false && $env !== '') { define('DB_PASS', $env); }
    $env = getenv('DB_NAME');
    if ($env !== false && $env !== '') { define('DB_NAME', $env); }
}

// Create database connection
try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Helpful error for development — in production you might log this instead
    die("Connection failed: " . $e->getMessage());
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Function to redirect if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: index.php");
        exit();
    }
}
?>