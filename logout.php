<?php
require_once 'config.php';

// Destroy session and redirect to login page
session_destroy();
header("Location: index.php");
exit();
?>