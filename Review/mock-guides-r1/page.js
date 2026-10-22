// Runs inside each option's page: the "Show only guides with a map tour" filter, option C's map swap, and the height report to the hub.
(function () {
  var body = document.body;
  var box = document.getElementById('tours');
  function settle() { // hide a region when the filter leaves it nothing
    var on = body.classList.contains('tours');
    document.querySelectorAll('.region,details[data-r]').forEach(function (r) {
      r.classList.toggle('none', on && !r.querySelector('[data-tour]'));
    });
  }
  if (box) box.addEventListener('change', function () { body.classList.toggle('tours', box.checked); settle(); });
  var mb = document.getElementById('morebtn');
  if (mb) mb.addEventListener('click', function () {
    var open = mb.getAttribute('aria-expanded') !== 'true';
    mb.setAttribute('aria-expanded', String(open));
    document.getElementById('more-tours').hidden = !open;
    mb.textContent = open ? mb.dataset.less : mb.dataset.more;
  });
  var map = document.querySelector('.cmap');
  if (map) {
    var imgs = {};
    map.querySelectorAll('img').forEach(function (i) { imgs[i.dataset.r] = i; });
    var show = function (id) { Object.keys(imgs).forEach(function (k) { imgs[k].classList.toggle('on', k === id); }); };
    var acc = document.querySelectorAll('details[data-r]');
    acc.forEach(function (d) {
      d.addEventListener('toggle', function () {
        var open = document.querySelector('details[data-r][open]');
        show(open ? open.dataset.r : 'spain');
      });
    });
    show('spain');
  }
  if (window.parent !== window) {
    var send = function () { parent.postMessage({ mockH: document.documentElement.scrollHeight, k: document.documentElement.dataset.k }, '*'); };
    new ResizeObserver(send).observe(body);
    window.addEventListener('load', send);
  }
})();
