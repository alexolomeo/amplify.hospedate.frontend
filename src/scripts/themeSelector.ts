type Theme = 'light' | 'dark';

export const updateToggleComponent = (theme: Theme): void => {
  const toggleComponent = document.getElementById(
    'theme-toggle'
  ) as HTMLInputElement | null;
  if (toggleComponent) {
    toggleComponent.checked = theme === 'dark';
  }
};

export const toggleTheme = (): void => {
  const currentTheme = document.documentElement.getAttribute(
    'data-theme'
  ) as Theme | null;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleComponent(newTheme);
};

window.addEventListener('DOMContentLoaded', () => {
  const theme = (localStorage.getItem('theme') as Theme) || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  updateToggleComponent(theme);

  const toggleComponent = document.getElementById(
    'theme-toggle'
  ) as HTMLInputElement | null;
  if (toggleComponent) {
    toggleComponent.addEventListener('change', toggleTheme);
  }
});
