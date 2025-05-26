import { startQuiz, restartQuiz } from './quizLogic.js';
import { showScreen } from './uiManager.js';
import { saveQuizState } from './storageManager.js';
import { displayCategoryInfo, loadQuestion, showResults } from './uiManager.js';

export function initQuiz() {
    const savedQuiz = localStorage.getItem('quizState');
    if (savedQuiz) {
        const quizState = JSON.parse(savedQuiz);
        if (quizState.inProgress) {
            startQuiz(quizState.category, quizState.questionIndex);
        }
    }

    // Cargar tema guardado
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const themeIcon = document.querySelector('.icon-theme');
    const themeSwitch = document.getElementById('themeSwitch');
    const themeText = document.getElementById('theme-text');

    if (darkMode) {
        document.body.classList.add('dark-mode');
        themeSwitch.checked = true;
        themeText.textContent = 'Dark';
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        document.body.classList.remove('dark-mode');
        themeSwitch.checked = false;
        themeText.textContent = 'Light';
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}


export function handleNextButtonClick() {
    const selectedAnswerIndex = window.selectedAnswerIndex;
    if (selectedAnswerIndex === -1) return;

     // Save user's answer
    window.userAnswers[window.currentQuestionIndex] = selectedAnswerIndex;

     // Check if answer is correct
    if (selectedAnswerIndex === window.currentQuestions[window.currentQuestionIndex].correctAnswer) {
        window.score++;
    }

     // Move to next question or show results
    if (window.currentQuestionIndex < window.currentQuestions.length - 1) {
        window.currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }

     // Save quiz state
    saveQuizState();
}