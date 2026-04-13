/* sch-samp/js/main.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── HAMBURGER MENU ──────────────────────────────────────── */
  const hamBtn = document.getElementById('hamBtn');
  const navDrawer = document.getElementById('navDrawer');

  hamBtn?.addEventListener('click', () => {
    const open = navDrawer.classList.toggle('open');
    hamBtn.classList.toggle('open', open);
    navDrawer.style.display = open ? 'flex' : 'none';
  });

  document.querySelectorAll('.dlink, .drawer-cta').forEach(a => {
    a.addEventListener('click', () => {
      hamBtn.classList.remove('open');
      navDrawer.classList.remove('open');
      setTimeout(() => { navDrawer.style.display = 'none'; }, 280);
    });
  });

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── STAT COUNTER ────────────────────────────────────────── */
  function countUp(el, target, format, duration = 1300) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.floor(eased * target);
      el.textContent = format(v);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    };
    requestAnimationFrame(step);
  }

  const statsSection = document.getElementById('heroStats');
  const statsObs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    statsObs.disconnect();
    document.querySelectorAll('.hs-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      const type   = el.dataset.type || 'default';
      if (type === 'k')   countUp(el, target, v => (v / 10).toFixed(1) + 'K');
      else if (type === 'pct') countUp(el, target, v => v + '%');
      else if (type === 'plus') countUp(el, target, v => v + '+');
      else countUp(el, target, v => String(v));
    });
  }, { threshold: 0.5 });
  if (statsSection) statsObs.observe(statsSection);

  /* ── HERO BARS ANIMATE ───────────────────────────────────── */
  setTimeout(() => {
    document.querySelectorAll('.hc-bar[data-w]').forEach(bar => {
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = bar.dataset.w; }, 500);
    });
  }, 400);

  /* ── MOD FILTER TABS ─────────────────────────────────────── */
  const modTabsEl = document.getElementById('modTabs');
  modTabsEl?.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('#modGrid .mod-card').forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.style.display = show ? 'block' : 'none';
    });
  });

  /* ── SMOOTH SCROLL ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});
