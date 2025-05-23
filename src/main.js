import './style.css'
import { quizData } from './data/quizData'
     
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryIcon = document.getElementById('category-icon');
    const categoryText = document.getElementById('category-text');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const nextBtn = document.getElementById('next-btn');
    const currentQuestionNum = document.getElementById('current-question-num');
    const progressBar = document.getElementById('progress-bar');
    const scoreValue = document.getElementById('score-value');
    const resultsContainer = document.getElementById('results-container');
    const restartBtn = document.getElementById('restart-btn');
    const homeBtn = document.getElementById('home-btn');
    const themeSwitch = document.getElementById('themeSwitch');
    const themeText = document.getElementById('theme-text');

    // Quiz State
    let currentCategory = '';
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let selectedAnswerIndex = -1;
    let userAnswers = [];
    let score = 0;

    // Initialize quiz from localStorage if available
    function initQuiz() {
        const savedQuiz = localStorage.getItem('quizState');
        if (savedQuiz) {
            const quizState = JSON.parse(savedQuiz);
            if (quizState.inProgress) {
                currentCategory = quizState.category;
                currentQuestions = quizData[currentCategory];
                currentQuestionIndex = quizState.questionIndex;
                userAnswers = quizState.userAnswers;

                startQuiz(currentCategory, quizState.questionIndex);
            }
        }

        // Check for saved theme preference
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            themeSwitch.checked = true;
            themeText.textContent = 'Dark';
        }
    }

    // Function to start the quiz
    function startQuiz(category, startFromQuestion = 0) {
        currentCategory = category;
        currentQuestions = quizData[category];
        currentQuestionIndex = startFromQuestion;
        userAnswers = userAnswers.slice(0, startFromQuestion);
        score = userAnswers.filter((answer, index) => answer === currentQuestions[index].correctAnswer).length;

        // Update UI
        showScreen(quizScreen);
        displayCategoryInfo(category);
        loadQuestion();

        // Save quiz state
        saveQuizState();
    }

    // Function to display category information
    function displayCategoryInfo(category) {
        categoryIcon.style.display = 'inline-flex';

        // Set category icon and text
        categoryIcon.className = 'category-icon';

        switch (category) {
            case 'html':
                categoryIcon.classList.add('html-icon');
                categoryIcon.innerHTML = '<i class="fab fa-html5 fa-lg text-white"></i>';
                categoryText.textContent = 'HTML';
                break;
            case 'css':
                categoryIcon.classList.add('css-icon');
                categoryIcon.innerHTML = '<i class="fab fa-css3-alt fa-lg text-white"></i>';
                categoryText.textContent = 'CSS';
                break;
            case 'javascript':
                categoryIcon.classList.add('js-icon');
                categoryIcon.innerHTML = '<i class="fab fa-js fa-lg text-white"></i>';
                categoryText.textContent = 'JavaScript';
                break;
            case 'accessibility':
                categoryIcon.classList.add('accessibility-icon');
                categoryIcon.innerHTML = '<i class="fas fa-universal-access fa-lg text-white"></i>';
                categoryText.textContent = 'Accesibilidad';
                break;
        }
    }

    // Function to load a question
    function loadQuestion() {
        const question = currentQuestions[currentQuestionIndex];

        // Reset selected answer
        selectedAnswerIndex = -1;
        nextBtn.disabled = true;

        // Update question number
        currentQuestionNum.textContent = currentQuestionIndex + 1;

        // Update progress bar
        const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Set question text
        questionText.textContent = question.question;

        // Create answer options
        answersContainer.innerHTML = '';

        const letters = ['A', 'B', 'C', 'D'];

        question.options.forEach((option, index) => {
            const answerOption = document.createElement('div');
            answerOption.className = 'answer-option animation-fade-in';
            answerOption.style.animationDelay = `${index * 0.1}s`;
            answerOption.dataset.index = index;

            answerOption.innerHTML = `
            <div class="option-letter">${letters[index]}</div>
            <div class="option-text">${option}</div>
            `;

            answerOption.addEventListener('click', () => selectAnswer(index));
            answersContainer.appendChild(answerOption);
        });

        // Update button text for last question
        if (currentQuestionIndex === currentQuestions.length - 1) {
            nextBtn.textContent = 'Ver Resultados';
        } else {
            nextBtn.textContent = 'Siguiente Pregunta';
        }
    }

    // Function to select an answer
    function selectAnswer(index) {
        // Prevent multiple selections once answered
        if (nextBtn.disabled === false && ['html', 'css', 'javascript'].includes(currentCategory)) return;

        // Remove selected class from all options
        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => option.classList.remove('selected'));

        // Add selected class to clicked option
        options[index].classList.add('selected');
        options[index].classList.add('animation-pulse');

        // Enable next button
        nextBtn.disabled = false;

        // Update selected answer index
        selectedAnswerIndex = index;

        // Immediate feedback for HTML, CSS, JavaScript
        if (['html', 'css', 'javascript'].includes(currentCategory)) {
            // Disable further clicks
            options.forEach(opt => {
                opt.style.pointerEvents = 'none';
            });

            const correctIndex = currentQuestions[currentQuestionIndex].correctAnswer;
            const isCorrect = (index === correctIndex);

            if (isCorrect) {
                // mark chosen as correct
                options[index].classList.add('correct');
            } else {
                // mark chosen as incorrect
                options[index].classList.add('incorrect');
                // highlight the correct one
                options[correctIndex].classList.add('correct');
            }

            // Enable next button now that feedback shown
            nextBtn.disabled = false;
            return;
        }

        // For Accessibility category - user must explicitly click next
        nextBtn.disabled = false;
    }

    // Function to handle next button click
    function handleNextButtonClick() {
        if (selectedAnswerIndex === -1) return;

        // Save user's answer
        userAnswers[currentQuestionIndex] = selectedAnswerIndex;

        // Check if answer is correct
        if (selectedAnswerIndex === currentQuestions[currentQuestionIndex].correctAnswer) {
            score++;
        }

        // Move to next question or show results
        if (currentQuestionIndex < currentQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResults();
        }

        // Save quiz state
        saveQuizState();
    }

    // Function to save quiz state to localStorage
    function saveQuizState() {
        const quizState = {
            inProgress: currentQuestionIndex < currentQuestions.length,
            category: currentCategory,
            questionIndex: currentQuestionIndex,
            userAnswers: userAnswers
        };

        localStorage.setItem('quizState', JSON.stringify(quizState));
    }

    // Function to show results
    function showResults() {
        showScreen(resultsScreen);

        // Update score
        scoreValue.textContent = score;

        // Create results list
        resultsContainer.innerHTML = '';

        currentQuestions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correctAnswer;
            const isCorrect = userAnswer === correctAnswer;

            const resultItem = document.createElement('div');
            resultItem.className = `result-item animation-fade-in ${isCorrect ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`;
            resultItem.style.animationDelay = `${index * 0.1}s`;

            resultItem.innerHTML = `
            <div class="question-result-wrapper">
                <div class="question-title">${index + 1}. ${question.question}</div>
                <span class="badge ms-2 ${isCorrect ? 'badge-correct' : 'badge-incorrect'}">
                ${isCorrect ? 'Correcto' : 'Incorrecto'}
                </span>
            </div>
            <div class="user-answer ${isCorrect ? 'text-success' : 'text-danger'}">
                Tu respuesta: ${question.options[userAnswer]}
            </div>
            ${!isCorrect ? `<div class="correct-answer text-success mt-1">
                Respuesta correcta: ${question.options[correctAnswer]}
            </div>` : ''}
            `;

            resultsContainer.appendChild(resultItem);
        });

        // Clear saved quiz state
        localStorage.removeItem('quizState');
    }

    // Function to restart the quiz
    function restartQuiz() {
        currentQuestionIndex = 0;
        selectedAnswerIndex = -1;
        userAnswers = [];
        score = 0;

        showScreen(welcomeScreen);

        // Hide category icon
        categoryIcon.style.display = 'none';
        categoryText.textContent = '';

        // Clear saved quiz state
        localStorage.removeItem('quizState');
    }

    // Function to switch between screens
    function showScreen(screen) {
        // Hide all screens
        welcomeScreen.classList.remove('active-screen');
        quizScreen.classList.remove('active-screen');
        resultsScreen.classList.remove('active-screen');

        // Show selected screen
        screen.classList.add('active-screen');
    }

    // Toggle theme between light and dark
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeText.textContent = isDarkMode ? 'Dark' : 'Light';

        // Save theme preference
        localStorage.setItem('darkMode', isDarkMode);
    }

    // Event Listeners
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            startQuiz(card.dataset.category);
        });
    });

    nextBtn.addEventListener('click', handleNextButtonClick);
    restartBtn.addEventListener('click', restartQuiz);
    homeBtn.addEventListener('click', restartQuiz);
    themeSwitch.addEventListener('change', toggleTheme);

    // Initialize the quiz
    initQuiz();