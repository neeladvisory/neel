(function () {
  var el = document.getElementById('flip');
  if (!el) return;
  var angle = 0, start = null, sx = 0, sy = 0, moved = false, timer = null;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function set(a, tilt, animate) {
    el.style.transition = animate && !still ? 'transform .6s cubic-bezier(.2,.7,.2,1)' : 'none';
    el.style.transform = 'rotateX(' + tilt + 'deg) rotateY(' + a + 'deg)';
  }
  function settle() {
    var back = Math.abs(Math.round(angle / 180)) % 2 === 1;
    el.setAttribute('aria-pressed', back ? 'true' : 'false');
    el.setAttribute('aria-label', 'Business card, ' + (back ? 'back' : 'front') + '. Tap or press Enter to flip it over.');
    set(angle, 0, true);
    clearTimeout(timer);
    timer = setTimeout(function () { el.setAttribute('data-rest', back ? 'back' : 'front'); }, still ? 0 : 650);
  }
  function wake() { clearTimeout(timer); el.removeAttribute('data-rest'); }
  function flip() { wake(); angle = Math.round(angle / 180) * 180 + 180; settle(); }
  el.addEventListener('pointerdown', function (e) {
    start = angle; sx = e.clientX; sy = e.clientY; moved = false;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
  });
  el.addEventListener('pointermove', function (e) {
    if (start === null) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 6) moved = true;
    if (!moved) return;
    wake();
    angle = start + dx / el.offsetWidth * 220;
    set(angle, Math.max(-14, Math.min(14, -dy / 6)), false);
  });
  function end() {
    if (start === null) return;
    if (moved) { angle = Math.round(angle / 180) * 180; settle(); } else { angle = start; flip(); }
    start = null;
  }
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', function () { if (start !== null) { angle = Math.round(angle / 180) * 180; start = null; settle(); } });
  el.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
  });
  el.setAttribute('data-rest', 'front');
})();
