import { quizData } from './data/quizData.js';
import { displayCategoryInfo, loadQuestion, showResults } from './uiManager.js';
import { showScreen } from './uiManager.js';
import { saveQuizState } from './storageManager.js';

// Quiz State (ahora en el objeto window para compartir entre módulos)
window.currentCategory = '';
window.currentQuestions = [];
window.currentQuestionIndex = 0;
window.selectedAnswerIndex = -1; 
window.userAnswers = [];
window.score = 0;

export function startQuiz(category, startFromQuestion = 0) {
    window.currentCategory = category; 
    window.currentQuestions = quizData[category];
    window.currentQuestionIndex = startFromQuestion;
    window.userAnswers = window.userAnswers.slice(0, startFromQuestion);
    window.score = window.userAnswers.filter((answer, index) => 
        answer === window.currentQuestions[index].correctAnswer
    ).length;

    // Update UI
    showScreen('quiz-screen');
    displayCategoryInfo(category);
    loadQuestion();

    // Save quiz state
    saveQuizState();
}

export function restartQuiz() {
    window.currentQuestionIndex = 0;
    window.selectedAnswerIndex = -1;
    window.userAnswers = [];
    window.score = 0;

    showScreen('welcome-screen');

    // Hide category icon
    const categoryIcon = document.getElementById('category-icon');
    categoryIcon.style.display = 'none';
    document.getElementById('category-text').textContent = '';

    // Clear saved quiz state
    localStorage.removeItem('quizState');
}