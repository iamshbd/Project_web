// Global State
let currentQuestions = [];
let currentIndex = 0;
let userAnswers = []; // 🔥 New: Stores index of selected options [0, 2, 1, ...]
let currentCategory = ""; 
let currentSubID = "";

/**
 * Triggered by Sidebar click
 */
function selectSubject(element) {
    currentCategory = element.getAttribute('data-cat');
    currentSubID = element.getAttribute('data-id');
    
    if (typeof questionData === 'undefined' || !questionData[currentCategory] || !questionData[currentCategory][currentSubID]) {
        console.error("Data mapping failed for:", currentCategory, currentSubID);
        alert("Subject data not found.");
        return;
    }

    currentQuestions = questionData[currentCategory][currentSubID];
    currentIndex = 0;
    
    // 🔥 Initialize userAnswers array with null values
    userAnswers = new Array(currentQuestions.length).fill(null);

    // UI SWITCH
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizWindow = document.getElementById('quiz-window');

    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (quizWindow) quizWindow.style.display = 'block';

    document.getElementById('quiz-title').innerText = currentSubID.replace('_', ' ');
    document.getElementById('quiz-category').innerText = `Path: ${currentCategory.toUpperCase()}`;

    renderQuestion();
}

/**
 * Renders the current question
 */
function renderQuestion() {
    const q = currentQuestions[currentIndex];
    
    // Update Text & Counter
    document.getElementById('main-question').innerText = q.question;
    document.getElementById('question-counter').innerText = `Question ${currentIndex + 1} / ${currentQuestions.length}`;
    
    // Update Progress Bar
    const progressPercent = ((currentIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercent}%`;

    // 🔥 Handle Previous Button Visibility
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'inline-block';
    }

    // Inject Options
    const container = document.getElementById('options-container');
    container.innerHTML = ''; 

    q.options.forEach((option, index) => {
        // 🔥 Check if this specific option was previously selected
        const isChecked = userAnswers[currentIndex] === index ? 'checked' : '';
        const letter = String.fromCharCode(65 + index);
        
        const optionHTML = `
            <label class="option-card">
                <input type="radio" name="quiz-option" value="${index}" ${isChecked}>
                <div class="option-content">
                    <span class="option-letter">${letter}</span>
                    <span class="option-label">${option}</span>
                </div>
            </label>
        `;
        container.insertAdjacentHTML('beforeend', optionHTML);
    });
}

/**
 * Moves to previous question
 */
function prevQuestion() {
    if (currentIndex > 0) {
        // Save current selection before going back (if any)
        const selected = document.querySelector('input[name="quiz-option"]:checked');
        if (selected) {
            userAnswers[currentIndex] = parseInt(selected.value);
        }

        currentIndex--;
        renderQuestion();
    }
}

/**
 * Handles 'Next' button
 */
async function nextQuestion() {
    const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
    
    if (!selectedOption) {
        alert("Please select an answer first!");
        return;
    }

    // 🔥 Save selection to array
    userAnswers[currentIndex] = parseInt(selectedOption.value);

    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        await submitFinalResults();
    }
}

/**
 * POST data to Node.js Backend
 */
async function submitFinalResults() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("Session expired. Please login.");
        window.location.href = "login.html";
        return;
    }

    // 🔥 Calculate final score from userAnswers array
    let finalCorrectCount = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === currentQuestions[index].correctAnswer) {
            finalCorrectCount++;
        }
    });

    const payload = {
        technology: currentCategory,
        subject: currentSubID,
        level: "basic",
        totalQuestions: currentQuestions.length,
        correct: finalCorrectCount
    };

    try {
        const response = await fetch('http://localhost:4000/api/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            alert(`Assessment Complete! Score: ${data.result.score}%`);
            window.location.href = "results.html";
        } else {
            alert("Submission failed: " + data.message);
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Could not connect to the server.");
    }
}