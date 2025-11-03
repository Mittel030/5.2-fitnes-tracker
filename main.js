import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let currentUser = null

const authContainer = document.getElementById('auth-container')
const mainContainer = document.getElementById('main-container')
const authMessage = document.getElementById('auth-message')

const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')
const showRegisterLink = document.getElementById('show-register')
const showLoginLink = document.getElementById('show-login')

const loginBtn = document.getElementById('login-btn')
const registerBtn = document.getElementById('register-btn')
const logoutBtn = document.getElementById('logout-btn')

const workoutForm = document.getElementById('workout-form')
const workoutsList = document.getElementById('workouts-list')

const totalWorkoutsEl = document.getElementById('total-workouts')
const totalMinutesEl = document.getElementById('total-minutes')
const totalCaloriesEl = document.getElementById('total-calories')

function showMessage(message, type) {
  authMessage.textContent = message
  authMessage.className = `message ${type}`
  setTimeout(() => {
    authMessage.className = 'message'
  }, 5000)
}

showRegisterLink.addEventListener('click', (e) => {
  e.preventDefault()
  loginForm.classList.remove('active')
  registerForm.classList.add('active')
  authMessage.className = 'message'
})

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault()
  registerForm.classList.remove('active')
  loginForm.classList.add('active')
  authMessage.className = 'message'
})

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  if (!email || !password) {
    showMessage('Vul alle velden in', 'error')
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    showMessage(error.message, 'error')
  } else {
    currentUser = data.user
    showMainApp()
  }
})

registerBtn.addEventListener('click', async () => {
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value

  if (!email || !password) {
    showMessage('Vul alle velden in', 'error')
    return
  }

  if (password.length < 6) {
    showMessage('Wachtwoord moet minimaal 6 karakters zijn', 'error')
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    showMessage(error.message, 'error')
  } else {
    currentUser = data.user
    showMessage('Account aangemaakt! Je wordt ingelogd...', 'success')
    setTimeout(() => {
      showMainApp()
    }, 1000)
  }
})

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut()
  currentUser = null
  showAuthScreen()
})

function showAuthScreen() {
  authContainer.style.display = 'flex'
  mainContainer.style.display = 'none'
  document.getElementById('login-email').value = ''
  document.getElementById('login-password').value = ''
  document.getElementById('register-email').value = ''
  document.getElementById('register-password').value = ''
}

function showMainApp() {
  authContainer.style.display = 'none'
  mainContainer.style.display = 'block'
  loadWorkouts()
  setTodayDate()
}

function setTodayDate() {
  const today = new Date().toISOString().split('T')[0]
  document.getElementById('workout-date').value = today
}

workoutForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const exerciseName = document.getElementById('exercise-name').value
  const duration = parseInt(document.getElementById('duration').value)
  const calories = parseInt(document.getElementById('calories').value)
  const date = document.getElementById('workout-date').value
  const notes = document.getElementById('notes').value

  const { error } = await supabase
    .from('workouts')
    .insert([
      {
        user_id: currentUser.id,
        exercise_name: exerciseName,
        duration_minutes: duration,
        calories_burned: calories,
        date: date,
        notes: notes,
      },
    ])

  if (error) {
    alert('Fout bij toevoegen workout: ' + error.message)
  } else {
    workoutForm.reset()
    setTodayDate()
    loadWorkouts()
  }
})

async function loadWorkouts() {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Fout bij laden workouts:', error)
    return
  }

  displayWorkouts(data)
  updateStats(data)
}

function displayWorkouts(workouts) {
  if (workouts.length === 0) {
    workoutsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💪</div>
        <p class="empty-state-text">Nog geen workouts. Voeg je eerste workout toe!</p>
      </div>
    `
    return
  }

  workoutsList.innerHTML = workouts
    .map(
      (workout) => `
      <div class="workout-item">
        <div class="workout-header">
          <div>
            <div class="workout-name">${workout.exercise_name}</div>
            <div class="workout-date">${formatDate(workout.date)}</div>
          </div>
          <button class="delete-btn" onclick="deleteWorkout('${workout.id}')">Verwijder</button>
        </div>
        <div class="workout-stats">
          <div class="workout-stat">
            <span>⏱️</span>
            <span class="workout-stat-value">${workout.duration_minutes}</span>
            <span>min</span>
          </div>
          <div class="workout-stat">
            <span>🔥</span>
            <span class="workout-stat-value">${workout.calories_burned}</span>
            <span>cal</span>
          </div>
        </div>
        ${workout.notes ? `<div class="workout-notes">${workout.notes}</div>` : ''}
      </div>
    `
    )
    .join('')
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function updateStats(workouts) {
  const totalWorkouts = workouts.length
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0)
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories_burned, 0)

  totalWorkoutsEl.textContent = totalWorkouts
  totalMinutesEl.textContent = totalMinutes
  totalCaloriesEl.textContent = totalCalories
}

window.deleteWorkout = async function (id) {
  if (!confirm('Weet je zeker dat je deze workout wilt verwijderen?')) {
    return
  }

  const { error } = await supabase.from('workouts').delete().eq('id', id)

  if (error) {
    alert('Fout bij verwijderen workout: ' + error.message)
  } else {
    loadWorkouts()
  }
}

(async () => {
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    currentUser = data.session.user
    showMainApp()
  } else {
    showAuthScreen()
  }
})()

supabase.auth.onAuthStateChange((_event, session) => {
  (async () => {
    if (session) {
      currentUser = session.user
      if (mainContainer.style.display === 'none') {
        showMainApp()
      }
    } else {
      currentUser = null
      showAuthScreen()
    }
  })()
})
