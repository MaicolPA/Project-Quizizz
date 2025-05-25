export function saveQuizState() {
    const quizState = {
        inProgress: window.currentQuestionIndex < window.currentQuestions.length,
        category: window.currentCategory,
        questionIndex: window.currentQuestionIndex,
        userAnswers: window.userAnswers
    };

    localStorage.setItem('quizState', JSON.stringify(quizState));
}