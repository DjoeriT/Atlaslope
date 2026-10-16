// Light paper or dark chrome: follows the system until the person picks one with the half-circle button (kept in localStorage).
const KEY = 'paraje-theme';

export function initTheme(button: HTMLButtonElement): void {
  const root = document.documentElement;
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
  let chosen: string | null = null;
  try { chosen = localStorage.getItem(KEY); } catch { /* storage blocked: follow the system */ }
  const apply = () => {
    root.dataset.theme = chosen ?? (sysDark.matches ? 'dark' : 'paper');
    button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  };
  sysDark.addEventListener('change', apply);
  button.addEventListener('click', () => {
    chosen = root.dataset.theme === 'dark' ? 'paper' : 'dark';
    try { localStorage.setItem(KEY, chosen); } catch { /* not kept, still applied */ }
    apply();
  });
  apply();
}
