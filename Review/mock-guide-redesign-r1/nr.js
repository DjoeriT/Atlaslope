// Options A, B, D: jump bar marker, and the big photo button (the unfold is shown in option C).
(function () {
  const j = document.querySelector('.g-jump');
  const links = j ? [...j.querySelectorAll('a')] : [];
  const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
  function pick() {
    const band = 56 + (j ? j.offsetHeight : 0);
    let cur = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= band + 130) cur = i; });
    links.forEach((l, i) => { if (i === cur) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
    const cl = links[cur];
    if (j) { j.style.setProperty('--mark-x', (cl ? cl.offsetLeft : 0) + 'px'); j.style.setProperty('--mark-w', (cl ? cl.offsetWidth : 0) + 'px'); }
  }
  addEventListener('scroll', pick, { passive: true });
  pick();
  document.querySelectorAll('.g-bigbtn').forEach((b) => b.addEventListener('click', () => {
    let n = document.querySelector('.g-note');
    if (!n) { n = document.createElement('p'); n.className = 'g-note'; b.after(n); }
    n.textContent = 'The unfold is built in option C. Try it there.';
  }));
})();
