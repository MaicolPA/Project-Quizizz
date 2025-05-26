import { startQuiz, restartQuiz, playAgainQuiz } from './quizLogic.js';
import { toggleTheme } from './themeManager.js';
import {handleNextButtonClick} from './quizManager.js';

export function setupEventListeners() {
    const themeSwitch = document.getElementById('themeSwitch');
    const themeText = document.getElementById('theme-text');
    const themeIcon = document.querySelector('.icon-theme');

    themeSwitch.addEventListener('change', () => {
        const isDark = themeSwitch.checked;

        if (isDark) {
            document.body.classList.add('dark-mode');
            themeText.textContent = 'Dark';
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.body.classList.remove('dark-mode');
            themeText.textContent = 'Light';
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }

        // Guardar la preferencia
        localStorage.setItem('darkMode', isDark);
    });    
    
    // Category cards 
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
                startQuiz(card.dataset.category);
        });
    });

     // Next button
    document.getElementById('next-btn').addEventListener('click', handleNextButtonClick);

     // Restart and home buttons
    document.getElementById('restart-btn').addEventListener('click', playAgainQuiz);
    document.getElementById('home-btn').addEventListener('click', restartQuiz);
}