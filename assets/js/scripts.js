document.addEventListener('DOMContentLoaded', function() {
    // Form validation for registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            if (password.length < 6) {
                e.preventDefault();
                alert('Password must be at least 6 characters long');
                return;
            }
            
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match');
                return;
            }
        });
    }
    
    // Workout form validation
    const workoutForm = document.getElementById('workoutForm');
    if (workoutForm) {
        workoutForm.addEventListener('submit', function(e) {
            const duration = document.getElementById('duration').value;
            const calories = document.getElementById('calories').value;
            
            if (duration < 1) {
                e.preventDefault();
                alert('Duration must be at least 1 minute');
                return;
            }
            
            if (calories < 0) {
                e.preventDefault();
                alert('Calories cannot be negative');
                return;
            }
        });
    }
    
    // Workout table filtering
    const searchWorkout = document.getElementById('searchWorkout');
    const filterType = document.getElementById('filterType');
    const workoutsTable = document.getElementById('workoutsTable');
    
    if (searchWorkout && filterType && workoutsTable) {
        function filterTable() {
            const searchText = searchWorkout.value.toLowerCase();
            const typeFilter = filterType.value.toLowerCase();
            const rows = workoutsTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            
            for (let row of rows) {
                const type = row.cells[1].textContent.toLowerCase();
                const textMatch = Array.from(row.cells).some(cell => 
                    cell.textContent.toLowerCase().includes(searchText)
                );
                const typeMatch = !typeFilter || type === typeFilter;
                
                row.style.display = (textMatch && typeMatch) ? '' : 'none';
            }
        }
        
        searchWorkout.addEventListener('input', filterTable);
        filterType.addEventListener('change', filterTable);
    }
});