// main.js
const API_BASE = 'http://localhost:4000/api/auth';

// Modal elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const closeBtn = document.getElementById('closeLogin');

const loginSuccess = document.getElementById('loginSuccess');
const loginError = document.getElementById('loginError');
const registerSuccess = document.getElementById('registerSuccess');
const registerError = document.getElementById('registerError');

// Expose functions globally
window.openLogin = function() {
    loginModal.style.display = 'flex';
    showLogin();
};

window.showLogin = function() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    clearMessages();
};

window.showRegister = function() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    clearMessages();
};

function clearMessages() {
    loginSuccess.style.display = 'none';
    loginError.style.display = 'none';
    registerSuccess.style.display = 'none';
    registerError.style.display = 'none';
}

// Close modal
closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
    clearMessages();
});
window.addEventListener('click', (e) => {
    if(e.target == loginModal){
        loginModal.style.display = 'none';
        clearMessages();
    }
});

// LOGIN
document.getElementById('loginFormElement').addEventListener('submit', async function(e){
    e.preventDefault();
    clearMessages();

    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if(res.ok){
            loginSuccess.style.display = 'block';
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => window.location.href='course.html', 1500);
        } else {
            loginError.textContent = data.message || 'Login failed';
            loginError.style.display = 'block';
        }

    } catch(err) {
        loginError.textContent = 'Server error, try again later.';
        loginError.style.display = 'block';
    }
});

// REGISTER
document.getElementById('registerFormElement').addEventListener('submit', async function(e){
    e.preventDefault();
    clearMessages();

    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if(res.ok){
            registerSuccess.style.display = 'block';
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => window.location.href='course.html', 1500);
        } else {
            registerError.textContent = data.message || 'Registration failed';
            registerError.style.display = 'block';
        }

    } catch(err) {
        registerError.textContent = 'Server error, try again later.';
        registerError.style.display = 'block';
    }
});

// Check login state and toggle buttons
function updateLoginState() {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if(token){
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
}

// Logout function
window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('You have been logged out.');
    updateLoginState();
    window.location.href = 'home.html'; // optional redirect
}

// Call this on page load
document.addEventListener('DOMContentLoaded', updateLoginState);