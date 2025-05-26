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

    // Check for saved theme preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeSwitch').checked = true;
        document.getElementById('theme-text').textContent = 'Dark';
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