// Hub: one frame per option (srcdoc, loaded when scrolled near), Desktop | Phone per option, #solo=a..d opens one option as the whole page.
(function () {
  var OPT = JSON.parse(document.getElementById('opts').textContent);
  var solo = /^#solo=([a-e])$/.exec(location.hash);
  if (solo) {
    document.documentElement.style.visibility = 'hidden';
    setTimeout(function () { document.open(); document.write(OPT[solo[1]]); document.close(); document.documentElement.style.visibility = ''; }, 0);
    return;
  }
  var loaded = {};
  function load(k) {
    if (loaded[k]) return;
    loaded[k] = true;
    document.querySelector('#opt-' + k + ' iframe').srcdoc = OPT[k];
  }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { load(e.target.dataset.k); io.unobserve(e.target); } }); }, { rootMargin: '800px 0px' });
  document.querySelectorAll('.opt').forEach(function (s) {
    io.observe(s);
    s.querySelectorAll('.seg button').forEach(function (b) {
      b.addEventListener('click', function () {
        s.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        s.querySelector('.frame').className = 'frame ' + b.dataset.m;
      });
    });
  });
  window.addEventListener('message', function (e) {
    if (!e.data || !e.data.mockH) return;
    var f = document.querySelector('#opt-' + e.data.k + ' iframe');
    if (f) f.style.height = e.data.mockH + 'px';
  });
  document.querySelectorAll('.switch a').forEach(function (a) {
    a.addEventListener('click', function () { var k = a.getAttribute('href').slice(5); load(k); });
  });
})();
