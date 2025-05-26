export function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.getElementById('theme-text').textContent = isDarkMode ? 'Dark' : 'Light';

     // Save theme preference
    localStorage.setItem('darkMode', isDarkMode);
}