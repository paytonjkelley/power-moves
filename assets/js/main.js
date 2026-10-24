/* =========================================================
   POWER MOVES — Homepage interactions
   No libraries. Everything here is progressive enhancement:
   the page still reads correctly if this file fails to load.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var mobileQuery = window.matchMedia('(max-width: 900px)');

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header background on scroll ---------- */
  var header = $('#site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- "Coming soon" toast for unbuilt destinations ----------
     Any link or button with data-soon="Name" shows this message.
     When a page goes live, give the link its real href and remove data-soon. */
  var toast = $('#toast');
  var toastMsg = $('#toast-msg');
  var toastTimer = null;
  function showToast(label) {
    if (!toast) return;
    toastMsg.textContent = label + ' is on the way.';
    toast.hidden = false;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2800);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-soon]');
    if (!el) return;
    e.preventDefault();
    closeContact();
    closeLoc();
    closeMenu();
    showToast(el.getAttribute('data-soon'));
  });

  /* ---------- Contact & Partnerships dropdown ---------- */
  var contactBtn = $('#contact-toggle');
  var contactMenu = $('#contact-menu');
  function closeContact() {
    if (!contactBtn) return;
    contactBtn.setAttribute('aria-expanded', 'false');
    contactMenu.hidden = true;
  }
  if (contactBtn) {
    contactBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = contactBtn.getAttribute('aria-expanded') === 'true';
      contactBtn.setAttribute('aria-expanded', String(!open));
      contactMenu.hidden = open;
    });
  }

  /* ---------- Mobile menu ---------- */
  var menu = $('#mobile-menu');
  var menuOpenBtn = $('#menu-open');
  var menuCloseBtn = $('#menu-close');
  function openMenu() {
    menu.hidden = false;
    document.body.classList.add('menu-open');
    menuOpenBtn.setAttribute('aria-expanded', 'true');
    menuCloseBtn.focus();
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    document.body.classList.remove('menu-open');
    menuOpenBtn.setAttribute('aria-expanded', 'false');
  }
  if (menu) {
    menuOpenBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', function () { closeMenu(); menuOpenBtn.focus(); });
    $$('a[href^="#"]:not([data-soon])', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
    mobileQuery.addEventListener('change', function (q) { if (!q.matches) closeMenu(); });
  }

  /* ---------- Location selector (Section 04) ---------- */
  var locBtn = $('#loc-toggle');
  var locMenu = $('#loc-menu');
  function closeLoc() {
    if (!locBtn) return;
    locBtn.setAttribute('aria-expanded', 'false');
    locMenu.hidden = true;
  }
  if (locBtn) {
    locBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = locBtn.getAttribute('aria-expanded') === 'true';
      locBtn.setAttribute('aria-expanded', String(!open));
      locMenu.hidden = open;
    });
    $('.loc-option', locMenu).addEventListener('click', closeLoc);
  }

  /* Close popovers on outside click or Escape */
  document.addEventListener('click', function (e) {
    if (contactMenu && !contactMenu.hidden && !e.target.closest('.dropdown')) closeContact();
    if (locMenu && !locMenu.hidden && !e.target.closest('.loc-wrap')) closeLoc();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (contactMenu && !contactMenu.hidden) { closeContact(); contactBtn.focus(); }
    if (locMenu && !locMenu.hidden) { closeLoc(); locBtn.focus(); }
    if (menu && !menu.hidden) { closeMenu(); menuOpenBtn.focus(); }
  });

  /* ---------- Scale the Section 03 mockups to their panels ---------- */
  var panels = $$('.panel');
  function scalePanels() {
    panels.forEach(function (p) {
      var stage = $('.stage', p);
      if (stage) stage.style.setProperty('--s', (p.clientWidth / 405).toFixed(4));
    });
  }
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(scalePanels);
    panels.forEach(function (p) { ro.observe(p); });
  } else {
    window.addEventListener('resize', scalePanels);
  }
  scalePanels();

  /* ---------- Experiences: filters, arrows, carousel dots ---------- */
  var track = $('#exp-track');
  if (track) {
    var tiles = $$('.tile', track);
    var defaultOrder = tiles.map(function (t) { return t.getAttribute('data-id'); });
    var byId = {};
    tiles.forEach(function (t) { byId[t.getAttribute('data-id')] = t; });
    var pills = $$('.pill');
    var counter = $('#exp-counter');
    var dots = $$('#exp-dots span');
    var selected = 'all';
    var offset = 0;
    var flip = false;

    function render() {
      var order = defaultOrder.slice();
      if (selected !== 'all') {
        order = [selected].concat(order.filter(function (id) { return id !== selected; }));
      }
      var k = ((offset % order.length) + order.length) % order.length;
      order = order.slice(k).concat(order.slice(0, k));
      order.forEach(function (id) { track.appendChild(byId[id]); });
      flip = !flip;
      track.classList.remove('fade-a', 'fade-b');
      void track.offsetWidth;
      track.classList.add(flip ? 'fade-a' : 'fade-b');
      if (counter) counter.textContent = byId[order[0]].getAttribute('data-n') + ' / 06';
      if (mobileQuery.matches) track.scrollTo({ left: 0, behavior: 'smooth' });
      updateDots();
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        selected = pill.getAttribute('data-filter');
        offset = 0;
        pills.forEach(function (p) { p.setAttribute('aria-pressed', String(p === pill)); });
        render();
      });
    });
    var prev = $('#exp-prev');
    var next = $('#exp-next');
    if (prev) prev.addEventListener('click', function () { offset -= 1; render(); });
    if (next) next.addEventListener('click', function () { offset += 1; render(); });

    function updateDots() {
      if (!dots.length) return;
      var first = track.querySelector('.tile');
      var step = first ? first.getBoundingClientRect().width + 12 : 304;
      var i = Math.max(0, Math.min(dots.length - 1, Math.round(track.scrollLeft / step)));
      dots.forEach(function (d, n) { d.classList.toggle('on', n === i); });
    }
    track.addEventListener('scroll', function () { window.requestAnimationFrame(updateDots); }, { passive: true });
  }
})();
