/* NEEL Advisory motion: scroll reveal, scroll progress, parallax, scroll-drawn
   paths, pointer tilt and magnetic buttons. Sets classes and CSS variables only.
   Without this script, or with reduced motion, everything simply shows. */
(function () {
  var SEL = '[data-r], .words, .steps, .receipt, .hl, .ul, .stamp, .chart, .mark';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('js-r');

  function settle(el) {
    var d = 0;
    try {
      getComputedStyle(el).transitionDelay.split(',').forEach(function (s) {
        var v = parseFloat(s) * (/ms/.test(s) ? 1 : 1000);
        if (v > d) d = v;
      });
    } catch (e) {}
    setTimeout(function () { el.classList.add('done'); }, d + 1300);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      if (e.target.hasAttribute('data-r')) settle(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  function scan() {
    var els = document.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) {
      if (els[i].__neelSeen) continue;
      els[i].__neelSeen = true;
      io.observe(els[i]);
    }
  }

  /* scroll: progress bar, parallax, scrubbed drawings */
  var scroller = null, scrolled = false, ticking = false;
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function update() {
    ticking = false;
    var sc = scroller || document.scrollingElement || root;
    var max = sc.scrollHeight - sc.clientHeight;
    var y = sc.scrollTop || 0;
    root.style.setProperty('--sy', y.toFixed(1));
    root.style.setProperty('--sp', max > 0 ? (y / max).toFixed(4) : '0');
    var vh = window.innerHeight || 800;
    var scrubs = document.querySelectorAll('[data-scrub]');
    for (var i = 0; i < scrubs.length; i++) {
      var r = scrubs[i].getBoundingClientRect();
      var p = (!scrolled && max <= 2) ? 1 : clamp((vh * 0.8 - r.top) / (r.height * 0.85 || 1));
      scrubs[i].style.setProperty('--p', p.toFixed(3));
    }
  }
  function onScroll(e) {
    var t = e && e.target;
    var sc = (!t || t === document || t.nodeType !== 1) ? (document.scrollingElement || root) : t;
    if (sc.clientHeight < (window.innerHeight || 0) * 0.5) return;
    scroller = sc; scrolled = true;
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  document.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } });

  /* pointer: cards tilt and catch light, buttons lean toward the cursor */
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var curCard = null, curBtn = null;
  function clearCard() {
    if (!curCard) return;
    curCard.style.removeProperty('--rx'); curCard.style.removeProperty('--ry');
    curCard = null;
  }
  function clearBtn() {
    if (!curBtn) return;
    curBtn.style.removeProperty('--bx'); curBtn.style.removeProperty('--by');
    curBtn = null;
  }
  function onMove(e) {
    var t = e.target && e.target.closest ? e.target : null;
    var card = t && t.closest('.lift');
    if (card !== curCard) clearCard();
    if (card) {
      curCard = card;
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      card.style.setProperty('--ry', ((x - 0.5) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
    }
    var btn = t && t.closest('.btn');
    if (btn !== curBtn) clearBtn();
    if (btn) {
      curBtn = btn;
      var b = btn.getBoundingClientRect();
      btn.style.setProperty('--bx', ((e.clientX - b.left - b.width / 2) * 0.16).toFixed(1) + 'px');
      btn.style.setProperty('--by', ((e.clientY - b.top - b.height / 2) * 0.3).toFixed(1) + 'px');
    }
  }
  if (fine) {
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', function () { clearCard(); clearBtn(); });
  }

  function start() {
    scan(); update();
    new MutationObserver(function () { scan(); }).observe(document.body || root, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* pause figure animations while they are off screen */
(function(){
  if(!('IntersectionObserver' in window)) return;
  var sel='.an,.zm,.pstage,.off,.d3s,.gtilt';
  var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('is-off',!e.isIntersecting);});},{rootMargin:'120px'});
  var seen=new WeakSet();
  function scan(){document.querySelectorAll(sel).forEach(function(n){if(!seen.has(n)){seen.add(n);io.observe(n);}});}
  scan(); setTimeout(scan,800); setTimeout(scan,2500);
})();
