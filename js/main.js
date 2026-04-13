/* ── SCH SAMP main.js ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* HAMBURGER */
  const hamBtn    = document.getElementById('hamBtn');
  const navDrawer = document.getElementById('navDrawer');
  hamBtn?.addEventListener('click', () => {
    const open = navDrawer.classList.toggle('open');
    hamBtn.classList.toggle('open', open);
    navDrawer.style.display = open ? 'flex' : 'none';
  });
  document.querySelectorAll('.dlink,.drawer-cta').forEach(a =>
    a.addEventListener('click', () => {
      hamBtn.classList.remove('open');
      navDrawer.classList.remove('open');
      setTimeout(() => { navDrawer.style.display = 'none'; }, 280);
    })
  );

  /* SCROLL REVEAL */
  const obs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }}),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => obs.observe(el));

  /* STAT COUNTER */
  function countUp(el, target, fmt, dur = 1300) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(step);
  }
  const statObs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    statObs.disconnect();
    document.querySelectorAll('.hs-num').forEach(el => {
      const t = +el.dataset.target, type = el.dataset.type || '';
      if (type === 'k')   countUp(el, t, v => (v / 10).toFixed(1) + 'K');
      else if (type === 'pct')  countUp(el, t, v => v + '%');
      else if (type === 'plus') countUp(el, t, v => v + '+');
      else countUp(el, t, v => String(v));
    });
  }, { threshold: 0.5 });
  const hs = document.getElementById('heroStats');
  if (hs) statObs.observe(hs);

  /* HERO BARS */
  setTimeout(() => {
    document.querySelectorAll('.hc-bar[data-w]').forEach(b => {
      b.style.width = '0%';
      setTimeout(() => { b.style.width = b.dataset.w; }, 500);
    });
  }, 400);

  /* MOD FILTER */
  document.getElementById('modTabs')?.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('#modGrid .mod-card').forEach(c => {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? 'block' : 'none';
    });
  });

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return; e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );

  /* COUNTDOWN — reset tiap tengah malam */
  function updateCountdown() {
    const now  = new Date();
    const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2,'0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
    const el = document.getElementById('dailyCountdown');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* DAILY FREE MODS — load dari data/free-mods.json */
  loadDailyMods();
});

async function loadDailyMods() {
  const todayEl   = document.getElementById('todayMod');
  const archiveEl = document.getElementById('modArchive');
  if (!todayEl && !archiveEl) return;

  try {
    const res  = await fetch('data/free-mods.json');
    const mods = await res.json();
    if (!mods || mods.length === 0) {
      showEmpty(todayEl, archiveEl);
      return;
    }

    /* Pilih mod hari ini berdasarkan tanggal (deterministik, berganti tiap hari) */
    const dayIndex = Math.floor(Date.now() / 86400000) % mods.length;
    const today    = mods[dayIndex];

    /* Render today card */
    if (todayEl) {
      todayEl.innerHTML = `
        <div class="tc-icon">${modIcon(today.category)}</div>
        <div class="tc-info">
          <div class="tc-cat">${today.category.toUpperCase()}</div>
          <div class="tc-name">${today.name}</div>
          <div class="tc-desc">${today.desc}</div>
          <div class="tc-meta">
            <span>📦 ${today.size || '—'}</span>
          </div>
        </div>
        <a class="tc-dl" href="${today.file}" download>
          <svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm7-18l-7 7h4v6h6v-6h4l-7-7z"/></svg>
          Download Gratis
        </a>`;
    }

    /* Render archive (semua kecuali today) */
    if (archiveEl) {
      const archive = mods.filter((_, i) => i !== dayIndex);
      if (archive.length === 0) {
        archiveEl.innerHTML = `<div class="daily-empty">Arsip akan muncul setelah lebih banyak mod di-upload.</div>`;
      } else {
        archiveEl.innerHTML = archive.map(m => `
          <div class="dmod-card">
            <div class="dmod-top">
              <div class="dmod-icon">${modIcon(m.category)}</div>
              <div>
                <div class="dmod-name">${m.name}</div>
                <div class="dmod-cat">${m.category.toUpperCase()}</div>
              </div>
            </div>
            <div class="dmod-desc">${m.desc}</div>
            <div class="dmod-foot">
              <span class="dmod-date">${formatDate(m.date)}</span>
              <a class="dmod-dl" href="${m.file}" download>
                <svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm7-18l-7 7h4v6h6v-6h4l-7-7z"/></svg>
                Download
              </a>
            </div>
          </div>`).join('');
      }
    }

  } catch(err) {
    showEmpty(todayEl, archiveEl);
    console.warn('Gagal load free-mods.json:', err);
  }
}

function showEmpty(todayEl, archiveEl) {
  if (todayEl) todayEl.innerHTML = `<p style="color:var(--gm);font-size:13px">Mod hari ini belum diupload. Cek lagi nanti!</p>`;
  if (archiveEl) archiveEl.innerHTML = `<div class="daily-empty">Belum ada arsip mod. Upload file ke <code>data/free-mods.json</code> untuk mulai.</div>`;
}

function modIcon(cat) {
  const c = (cat || '').toLowerCase();
  if (c === 'hud')     return `<svg viewBox="0 0 24 24"><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/></svg>`;
  if (c === 'bot')     return `<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H3a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2M7 14v1a5 5 0 0010 0v-1H7zm3 2h1v1h-1v-1zm3 0h1v1h-1v-1z"/></svg>`;
  if (c === 'launcher')return `<svg viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>`;
  /* default script */  return `<svg viewBox="0 0 24 24"><path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4zm-5.2 0L4.8 12l4.6-4.6L8 6 2 12l6 6 1.4-1.4z"/></svg>`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
  } catch { return dateStr; }
}
