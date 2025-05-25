import { startQuiz, restartQuiz } from './quizLogic.js';
import { toggleTheme } from './themeManager.js';
import {handleNextButtonClick} from './quizManager.js';

export function setupEventListeners() {
    // Category cards 
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            startQuiz(card.dataset.category);
        });
    });

    // Next button
    document.getElementById('next-btn').addEventListener('click', handleNextButtonClick);

    // Restart and home buttons
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
    document.getElementById('home-btn').addEventListener('click', restartQuiz);

    // Theme switch
    document.getElementById('themeSwitch').addEventListener('change', toggleTheme);
}