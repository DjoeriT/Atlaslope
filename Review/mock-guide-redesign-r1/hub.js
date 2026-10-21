// Hub: loads each option into its own frame (lazily), toggles desktop / phone, opens one option full screen (#solo=a..d).
(function () {
  const doc = (k) => window.OPT[k].replace('/*FONTS*/', () => window.FONTS).replace(/data-p="([\w-]+)"/g, (m, id) => 'src="' + window.IMG[id] + '"');
  const solo = /^#solo=([abcd])$/.exec(location.hash);
  if (solo) { // after parsing, so that document.open() really replaces the hub
    document.documentElement.style.visibility = 'hidden';
    setTimeout(() => { document.open(); document.write(doc(solo[1])); document.close(); }, 0);
    return;
  }
  const loaded = {};
  function load(k) {
    const sec = document.getElementById('opt-' + k), fr = sec.querySelector('.frame'), f = fr.querySelector('iframe');
    if (loaded[k]) return loaded[k];
    loaded[k] = new Promise((res) => { f.addEventListener('load', () => { fr.classList.add('on'); res(f); }, { once: true }); f.srcdoc = doc(k); });
    return loaded[k];
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { load(e.target.dataset.k); io.unobserve(e.target); } }), { rootMargin: '500px 0px' });
  document.querySelectorAll('.opt').forEach((s) => {
    io.observe(s);
    s.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
      s.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      s.querySelector('.frame').className = 'frame ' + b.dataset.m + (s.querySelector('.frame').classList.contains('on') ? ' on' : '');
    }));
  });
  addEventListener('message', async (e) => {
    if (!e.data || e.data.sg !== 'unfold-in-c') return;
    document.getElementById('opt-c').scrollIntoView({ behavior: 'smooth' });
    const f = await load('c');
    setTimeout(() => f.contentWindow.postMessage({ sg: 'unfold' }, '*'), 900);
  });
})();
