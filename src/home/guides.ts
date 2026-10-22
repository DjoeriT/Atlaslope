// The Guides page's one script: the "Show all map tours" button folds the other tour guides out of the band.
export const initGuides = (): void => {
  const btn = document.getElementById('morebtn');
  const more = document.getElementById('more-tours');
  if (!btn || !more) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    more.hidden = !open;
    btn.textContent = (open ? btn.dataset.less : btn.dataset.more) ?? '';
  });
};
