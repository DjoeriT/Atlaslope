// The search field in the plain pages' bar (owner, 21 Oct 2026: search in the top bar at all times). Same look and keys as the atlas's
// (src/cards/SearchBox.tsx): Enter opens the best match, arrows walk the list, Escape clears. The index loads on first focus, not on page load.
import { plainSearch, type Hit } from './plainSearch';

export function initSearch(): void {
  const box = document.querySelector<HTMLElement>('.sitebar .search');
  const input = box?.querySelector('input');
  if (!box || !input) return;
  const atlas = box.dataset.atlas ?? 'atlas/';
  let find: ((query: string, limit?: number) => Hit[]) | undefined;
  let loading: Promise<void> | undefined;
  const list = document.createElement('ul');
  list.className = 'results';
  list.setAttribute('aria-label', box.dataset.results ?? 'Search results');
  list.hidden = true;
  box.append(list);

  const load = () => (loading ??= import('virtual:search-index').then((m) => { find = plainSearch(m.default, atlas); }));
  const links = () => [...list.querySelectorAll<HTMLAnchorElement>('a')];
  function render() {
    list.replaceChildren();
    const q = input!.value.trim();
    list.hidden = q === '';
    if (!q || !find) return;
    const hits = find(q);
    if (!hits.length) {
      const p = document.createElement('p');
      p.setAttribute('role', 'status');
      p.textContent = box!.dataset.none ?? '';
      const li = document.createElement('li');
      li.append(p);
      list.append(li);
    }
    for (const h of hits) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = h.href;
      const name = document.createElement('span');
      name.textContent = h.crumb.name;
      const kind = document.createElement('small');
      kind.textContent = h.crumb.matchedGrape ? `${h.crumb.matchedGrape} · main grape` : h.crumb.level;
      a.append(name, kind);
      li.append(a);
      list.append(li);
    }
  }
  const clear = () => { input.value = ''; render(); };
  input.addEventListener('focus', () => { void load().then(render); });
  input.addEventListener('input', () => { void load().then(render); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const first = links()[0]; if (first) location.href = first.href; }
    else if (e.key === 'Escape') clear();
    else if (e.key === 'ArrowDown') { e.preventDefault(); links()[0]?.focus(); }
  });
  list.addEventListener('keydown', (e) => {
    const all = links();
    const i = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); all[i + 1]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); (all[i - 1] ?? input).focus(); }
    else if (e.key === 'Escape') { input.focus(); clear(); }
  });
  document.addEventListener('click', (e) => { if (!box.contains(e.target as Node)) list.hidden = true; });
}
