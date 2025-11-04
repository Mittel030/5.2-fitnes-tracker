<?php
require_once 'config.php';
requireLogin();

// Fetch user's workouts
$stmt = $conn->prepare("
    SELECT * FROM workouts 
    WHERE user_id = ? 
    ORDER BY date DESC, id DESC
");
$stmt->execute([$_SESSION['user_id']]);
$workouts = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitTrack - Dashboard</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <header class="dashboard-header">
            <h1>Welcome, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</h1>
            <nav>
                <a href="add_workout.php" class="btn">Add Workout</a>
                <a href="logout.php" class="btn btn-secondary">Logout</a>
            </nav>
        </header>

        <div class="workout-list">
            <h2>Your Workouts</h2>
            
            <?php if (empty($workouts)): ?>
                <p>No workouts recorded yet. Start by adding your first workout!</p>
            <?php else: ?>
                <div class="filters">
                    <input type="text" id="searchWorkout" placeholder="Search workouts...">
                    <select id="filterType">
                        <option value="">All Types</option>
                        <?php
                        $types = array_unique(array_column($workouts, 'type'));
                        foreach ($types as $type) {
                            echo '<option value="' . htmlspecialchars($type) . '">' . htmlspecialchars($type) . '</option>';
                        }
                        ?>
                    </select>
                </div>

                <table id="workoutsTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Duration (min)</th>
                            <th>Calories</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($workouts as $workout): ?>
                            <tr>
                                <td><?php echo htmlspecialchars(date('Y-m-d', strtotime($workout['date']))); ?></td>
                                <td><?php echo htmlspecialchars($workout['type']); ?></td>
                                <td><?php echo htmlspecialchars($workout['duration']); ?></td>
                                <td><?php echo htmlspecialchars($workout['calories']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
    <script src="assets/js/scripts.js"></script>
</body>
</html>