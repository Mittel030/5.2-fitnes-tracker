<?php
require_once 'config.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $date = $_POST['date'];
    $type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING);
    $duration = filter_input(INPUT_POST, 'duration', FILTER_VALIDATE_INT);
    $calories = filter_input(INPUT_POST, 'calories', FILTER_VALIDATE_INT);
    
    if ($date && $type && $duration && $calories) {
        try {
            $stmt = $conn->prepare("
                INSERT INTO workouts (user_id, date, type, duration, calories) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$_SESSION['user_id'], $date, $type, $duration, $calories]);
            
            header("Location: dashboard.php?added=1");
            exit();
        } catch (PDOException $e) {
            $error = "Failed to add workout. Please try again.";
        }
    } else {
        $error = "Please fill all fields with valid values.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitTrack - Add Workout</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <h1>Add New Workout</h1>
        
        <?php if (isset($error)): ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" class="form-container" id="workoutForm">
            <div class="form-group">
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required 
                       value="<?php echo date('Y-m-d'); ?>">
            </div>
            
            <div class="form-group">
                <label for="type">Exercise Type:</label>
                <select id="type" name="type" required>
                    <option value="">Select type</option>
                    <option value="Running">Running</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Weight Training">Weight Training</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="duration">Duration (minutes):</label>
                <input type="number" id="duration" name="duration" min="1" required>
            </div>
            
            <div class="form-group">
                <label for="calories">Calories Burned:</label>
                <input type="number" id="calories" name="calories" min="0" required>
            </div>
            
            <button type="submit">Add Workout</button>
            <a href="dashboard.php" class="btn btn-secondary">Cancel</a>
        </form>
    </div>
    <script src="assets/js/scripts.js"></script>
</body>
</html>