
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;

  // Load saved theme or respect system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    icon.className = theme === 'dark' 
      ? 'bi bi-sun' 
      : 'bi bi-moon';
    icon.title = theme === 'dark' 
      ? 'Switch to light mode' 
      : 'Switch to dark mode';
  }
});