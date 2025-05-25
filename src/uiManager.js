export function showScreen(screenId) {
    // Hide all screens
    document.getElementById('welcome-screen').classList.remove('active-screen');
    document.getElementById('quiz-screen').classList.remove('active-screen');
    document.getElementById('results-screen').classList.remove('active-screen');

    // Show selected screen
    document.getElementById(screenId).classList.add('active-screen');
}

export function displayCategoryInfo(category) {
    const categoryIcon = document.getElementById('category-icon');
    const categoryText = document.getElementById('category-text');
    
    categoryIcon.style.display = 'inline-flex';
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

export function loadQuestion() {
    const question = window.currentQuestions[window.currentQuestionIndex];
    const answersContainer = document.getElementById('answers-container');
    const nextBtn = document.getElementById('next-btn');

    // Reset selected answer
    window.selectedAnswerIndex = -1;
    nextBtn.disabled = true;

    // Update question number
    document.getElementById('current-question-num').textContent = window.currentQuestionIndex + 1;

    // Update progress bar
    const progress = ((window.currentQuestionIndex) / window.currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;

    // Set question text
    document.getElementById('question-text').textContent = question.question;

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
    if (window.currentQuestionIndex === window.currentQuestions.length - 1) {
        nextBtn.textContent = 'Ver Resultados';
    } else {
        nextBtn.textContent = 'Siguiente Pregunta';
    }
}

export function selectAnswer(index) {
    const nextBtn = document.getElementById('next-btn');
    const options = document.querySelectorAll('.answer-option');

    // Prevent multiple selections once answered
    if (nextBtn.disabled === false && ['html', 'css', 'javascript', 'accessibility'].includes(window.currentCategory)) return;

    // Remove selected class from all options
    options.forEach(option => option.classList.remove('selected'));

    // Add selected class to clicked option
    options[index].classList.add('selected');
    options[index].classList.add('animation-pulse');

    // Enable next button
    nextBtn.disabled = false;

    // Update selected answer index
    window.selectedAnswerIndex = index;

    // Immediate feedback for HTML, CSS, JavaScript
    if (['html', 'css', 'javascript', 'accessibility'].includes(window.currentCategory)) {
        // Disable further clicks
        options.forEach(opt => {
            opt.style.pointerEvents = 'none';
        });

        const correctIndex = window.currentQuestions[window.currentQuestionIndex].correctAnswer;
        const isCorrect = (index === correctIndex);

        if (isCorrect) {
            options[index].classList.add('correct');
        } else {
            options[index].classList.add('incorrect');
            options[correctIndex].classList.add('correct');
        }

        nextBtn.disabled = false;
        return;
    }

    nextBtn.disabled = false;
}

export function showResults() {
    showScreen('results-screen');

    // Update score
    document.getElementById('score-value').textContent = window.score;

    // Create results list
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    window.currentQuestions.forEach((question, index) => {
        const userAnswer = window.userAnswers[index];
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
}