/* =========================================================================
   ROYAL ENGAGEMENT INVITATION — script.js
   -------------------------------------------------------------------------
   1. CONFIG ............. EDIT THIS: every name, date, venue, number, photo
   2. Helpers
   3. Content binding .... pushes CONFIG into the page
   4. Gate (doors) ....... cinematic 3D double-door opening
   5. Petals ............. floating rose petals
   6. Reveal ............. scroll-triggered animations
   7. Countdown
   8. Timeline (love story)
   9. Gallery + lightbox
  10. RSVP (WhatsApp)
  11. Navigation
  12. Calendar / maps links
   ========================================================================= */

/* =========================================================================
   1. CONFIGURATION — change everything about the invitation here
   ========================================================================= */
const CONFIG = {
  couple: {
    groom: 'Tabish',
    bride: 'Dua',
    initials: 'T & D',          // shown in the footer and the menu
    sealText: 'T&D',            // shown on the golden wax seal (keep it short)
    displayOrder: ['groom', 'bride'], // who is named first on the hero
    couplePhoto: ''             // optional: 'assets/couple.jpg' replaces the illustration
  },

  event: {
    date: '2026-12-19',         // YYYY-MM-DD
    time: '19:30',              // 24h HH:MM
    durationHours: 4,           // used for "Add to calendar"
    ceremonyTitle: 'Engagement Ceremony',
    venueName: 'The Royal Palace Banquet',
    venueAddress: '12 Garden Avenue, Civil Lines, Your City, Country',
    venueCity: 'Your City, Country',
    mapsLink: ''                // paste a Google Maps share link, or leave '' to search the address
  },

  families: {
    groom: { parents: 'Mr. & Mrs. Groom Parents', family: 'The Groom Family' },
    bride: { parents: 'Mr. & Mrs. Bride Parents', family: 'The Bride Family' }
  },

  rsvp: {
    whatsappNumber: '919999999999', // country code + number, digits only (no + or spaces)
    maxGuests: 8,
    successMessage: 'Your response is on its way. We can’t wait to celebrate with you.'
  },

  story: [
    { date: 'Spring 2023',      title: 'The First Meeting',
      text: 'A chance hello that turned into hours of conversation, and a quiet feeling that something beautiful had begun.',
      photo: '' },
    { date: 'Summer 2024', title: 'The Beginning of Forever',
      text: 'Through laughter, little adventures and family blessings, two hearts found they were already home with each other.',
      photo: '' },
    { date: 'December 2026',          title: 'The Engagement',
      text: 'With our families beside us, a ring, a promise, and a yes that we will cherish for the rest of our lives.',
      photo: '' }
  ],
  // Tip: put real dates in the "date" field above, e.g. 'March 2024'.

  // Gallery photographs. Leave src '' to show an elegant placeholder.
  gallery: [
    { src: '', caption: 'Our first photograph together' },
    { src: '', caption: 'Moments we adore' },
    { src: '', caption: 'Laughter and love' },
    { src: '', caption: 'Beginning of forever' },
    { src: '', caption: 'Our families' },
    { src: '', caption: 'Together forever' }
  ],

  social: {                      // leave '' to hide an icon
    instagram: '',
    facebook: '',
    whatsapp: true,              // uses rsvp.whatsappNumber
    email: ''
  }
};

/* =========================================================================
   2. HELPERS
   ========================================================================= */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n, l = 2) => String(n).padStart(l, '0');
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function parseEventDate() {
  const [y, m, d] = CONFIG.event.date.split('-').map(Number);
  const [hh, mm]  = CONFIG.event.time.split(':').map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0, 0);
}
function fmtTime(date) {
  let h = date.getHours(); const m = date.getMinutes(); const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12; return `${h}:${pad(m)} ${ap}`;
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function safeStorage(fn) { try { return fn(); } catch (e) { return null; } }

/* =========================================================================
   3. CONTENT BINDING — copy CONFIG values into [data-t] elements
   ========================================================================= */
const EVENT_DATE = parseEventDate();

function bindContent() {
  const c = CONFIG, ev = c.event, when = EVENT_DATE;
  const first  = c.couple[c.couple.displayOrder[0]];
  const second = c.couple[c.couple.displayOrder[1]];
  const dateLong = `${DAYS[when.getDay()]}, ${when.getDate()} ${MONTHS[when.getMonth()]} ${when.getFullYear()}`;
  const end = new Date(when.getTime() + ev.durationHours * 3600e3);

  const view = {
    firstName: first, secondName: second,
    groomName: c.couple.groom, brideName: c.couple.bride,
    initials: c.couple.initials, sealText: c.couple.sealText,
    dateLong,
    dayLine:  `${DAYS[when.getDay()]} · ${when.getDate()} ${MONTHS[when.getMonth()]} ${when.getFullYear()}`,
    timeLine: `At ${fmtTime(when)}`,
    timeRange: `${fmtTime(when)} onwards`,
    dateShort: `${pad(when.getDate())} · ${pad(when.getMonth() + 1)} · ${when.getFullYear()}`,
    venueName: ev.venueName, venueAddress: ev.venueAddress, venueCity: ev.venueCity,
    groomParents: c.families.groom.parents, brideParents: c.families.bride.parents,
    groomFamily: c.families.groom.family,   brideFamily: c.families.bride.family
  };
  $$('[data-t]').forEach(el => { const k = el.dataset.t; if (k in view) el.textContent = view[k]; });

  document.title = `${first} & ${second} — Engagement Invitation`;

  // Optional real couple photo replaces the illustration
  if (c.couple.couplePhoto) {
    const img = $('#couplePhoto'); img.src = c.couple.couplePhoto; img.alt = `${first} and ${second}`; img.hidden = false;
    $('#coupleArt').style.display = 'none';
  }
  // Map + calendar links
  const q = encodeURIComponent(`${ev.venueName}, ${ev.venueAddress}`);
  $('#mapBtn').href = ev.mapsLink || `https://www.google.com/maps/search/?api=1&query=${q}`;

  const stamp = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Engagement Invitation//EN','BEGIN:VEVENT',
    `UID:engagement-${stamp(when)}@invitation`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(when)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${ev.ceremonyTitle} — ${first} & ${second}`,
    `LOCATION:${ev.venueName}\\, ${ev.venueAddress}`, 'END:VEVENT','END:VCALENDAR'].join('\r\n');
  $('#calBtn').href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);

  // Social icons
  const s = c.social, items = [];
  if (s.instagram) items.push(['Instagram', s.instagram, 'i-insta']);
  if (s.facebook)  items.push(['Facebook',  s.facebook,  'i-fb']);
  if (s.whatsapp)  items.push(['WhatsApp', `https://wa.me/${c.rsvp.whatsappNumber}`, 'i-wa']);
  if (s.email)     items.push(['Email', `mailto:${s.email}`, 'i-mail']);
  $('#social').innerHTML = items.map(([n, h, i]) =>
    `<li><a href="${esc(h)}" target="_blank" rel="noopener" aria-label="${n}"><svg><use href="#${i}"/></svg></a></li>`).join('');
}

/* =========================================================================
   4. GATE — cinematic 3D double-door opening
   ========================================================================= */
function initGate() {
  const gate = $('#gate'), body = document.body;
  let opened = false;

  function open() {
    if (opened) return; opened = true;
    gate.classList.add('is-opening');
    safeStorage(() => sessionStorage.setItem('opened', '1'));
    const total = reduceMotion ? 700 : 3000;
    setTimeout(() => body.classList.add('is-open'), reduceMotion ? 100 : 900); // hero animates in as doors part
    setTimeout(() => {
      gate.classList.add('is-gone');
      body.classList.remove('is-locked');
      const root = document.documentElement; root.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); root.style.scrollBehavior = '';
      startPetals();
    }, total);
  }
  gate.addEventListener('click', open);
  gate.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  $('#seal').addEventListener('click', e => { e.stopPropagation(); open(); });
  // Allow ?open in the URL to skip the doors (handy while editing)
  if (/[?&]open\b/.test(location.search)) { gate.classList.add('is-gone'); body.classList.remove('is-locked'); body.classList.add('is-open'); opened = true; startPetals(); }
  else gate.focus({ preventScroll: true });
}

/* =========================================================================
   5. PETALS — lightweight floating rose petals (CSS-animated)
   ========================================================================= */
let petalsStarted = false;
function startPetals() {
  if (petalsStarted || reduceMotion) return; petalsStarted = true;
  const box = $('#petals');
  const count = window.innerWidth < 600 ? 9 : 16;
  const tints = ['#f4c9c6', '#f7d9d2', '#efb7b6', '#fbe6dc'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    const size = 12 + Math.random() * 14;
    p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * 1.25}px;` +
      `animation-duration:${14 + Math.random() * 14}s,${3 + Math.random() * 3}s;` +
      `animation-delay:${-Math.random() * 24}s,${-Math.random() * 5}s;` +
      `--drift:${(Math.random() * 120 - 60).toFixed(0)}px;--tint:${tints[i % tints.length]};opacity:${0.55 + Math.random() * 0.35}`;
    box.appendChild(p);
  }
}

/* =========================================================================
   6. REVEAL — scroll-triggered fade & slide
   ========================================================================= */
function initReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(e => io.observe(e));
  window.__reveal = io;
}

/* =========================================================================
   7. COUNTDOWN
   ========================================================================= */
function initCountdown() {
  const nums = {}; $$('.cd__num').forEach(n => nums[n.dataset.unit] = n);
  const box = $('#cd'), done = $('#cdDone');
  const last = {};
  function set(unit, val) {
    const text = unit === 'days' ? pad(val, 2) : pad(val);
    if (last[unit] === text) return;
    const el = nums[unit]; el.textContent = text;
    if (last[unit] !== undefined && !reduceMotion) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    last[unit] = text;
  }
  function tick() {
    let diff = EVENT_DATE - new Date();
    if (diff <= 0) { box.hidden = true; done.hidden = false; return false; }
    box.hidden = false; done.hidden = true;
    const s = Math.floor(diff / 1000);
    set('days', Math.floor(s / 86400)); set('hours', Math.floor(s % 86400 / 3600));
    set('minutes', Math.floor(s % 3600 / 60)); set('seconds', s % 60);
    return true;
  }
  if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }
}

/* =========================================================================
   8. TIMELINE — our love story
   ========================================================================= */
function initStory() {
  $('#timeline').innerHTML = CONFIG.story.map((m, i) => `
    <li class="tl reveal ${i % 2 ? 'tl--r' : 'tl--l'}">
      <span class="tl__node" aria-hidden="true"></span>
      <div class="tl__card">
        ${m.photo ? `<img class="tl__img" src="${esc(m.photo)}" alt="${esc(m.title)}" loading="lazy" width="400" height="300">` : ''}
        <p class="tl__date">${esc(m.date)}</p>
        <h3 class="script script--sm">${esc(m.title)}</h3>
        <p class="body-it">${esc(m.text)}</p>
      </div>
    </li>`).join('');
}

/* =========================================================================
   9. GALLERY + LIGHTBOX
   ========================================================================= */
function initGallery() {
  const photos = CONFIG.gallery, track = $('#galTrack'), dots = $('#galDots');
  const ph = (i) => `<div class="ph" aria-label="Photo placeholder ${i + 1}">
      <svg class="ph__orn"><use href="#sprig"/></svg><span class="ph__mono">${esc(CONFIG.couple.sealText)}</span>
      <span class="ph__txt">Your photo here</span></div>`;

  track.innerHTML = photos.map((p, i) => `
    <figure class="card" data-i="${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${photos.length}">
      <button type="button" class="card__btn" aria-label="Open photo ${i + 1}">
        <span class="card__mat">${p.src ? `<img src="${esc(p.src)}" alt="${esc(p.caption || 'Engagement photograph')}" loading="lazy" decoding="async" width="600" height="800">` : ph(i)}</span>
      </button>
      ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}
    </figure>`).join('');
  dots.innerHTML = photos.map(() => '<i></i>').join('');

  const cards = $$('.card', track), dotEls = $$('i', dots);
  const step = () => { const c = cards[0]; return c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 16); };
  const current = () => Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / step())));
  function updateUI() {
    const i = current();
    dotEls.forEach((d, k) => d.classList.toggle('on', k === i));
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    const max = track.scrollWidth - track.clientWidth - 2;
    $('#galPrev').disabled = track.scrollLeft <= 2; $('#galNext').disabled = track.scrollLeft >= max;
  }
  const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
  $('#galPrev').addEventListener('click', () => go(-1));
  $('#galNext').addEventListener('click', () => go(1));
  let raf; track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(updateUI); }, { passive: true });
  window.addEventListener('resize', updateUI);
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });

  // Desktop mouse-drag (touch uses native swipe + scroll-snap)
  let down = false, sx = 0, sl = 0, moved = false;
  track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
  window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; track.classList.add('drag'); } track.scrollLeft = sl - dx; });
  window.addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('drag'); });
  track.addEventListener('click', e => {
    if (moved) { moved = false; return; }
    const card = e.target.closest('.card'); if (card) openLightbox(+card.dataset.i);
  });
  updateUI();

  /* ---- Lightbox ---- */
  const lb = $('#lb'), fig = $('#lbFig'), count = $('#lbCount');
  let idx = 0, lastFocus = null;
  function render(dir) {
    const p = photos[idx];
    fig.className = 'lb__fig ' + (dir > 0 ? 'from-r' : dir < 0 ? 'from-l' : 'from-z');
    void fig.offsetWidth;
    fig.innerHTML = `<div class="lb__mat">${p.src ? `<img src="${esc(p.src)}" alt="${esc(p.caption || '')}">` : ph(idx)}</div>${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}`;
    fig.classList.add('play');
    count.textContent = `${idx + 1} / ${photos.length}`;
  }
  function openLightbox(i) { idx = i; lastFocus = document.activeElement; lb.hidden = false; document.body.classList.add('is-locked'); render(0); requestAnimationFrame(() => lb.classList.add('on')); $('#lbClose').focus(); }
  function closeLightbox() { lb.classList.remove('on'); document.body.classList.remove('is-locked'); setTimeout(() => { lb.hidden = true; }, 300); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  function nav(d) { idx = (idx + d + photos.length) % photos.length; render(d); }
  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', () => nav(-1));
  $('#lbNext').addEventListener('click', () => nav(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowRight') nav(1); if (e.key === 'ArrowLeft') nav(-1);
  });
  // swipe inside lightbox
  let tx = 0; lb.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) nav(dx < 0 ? 1 : -1); }, { passive: true });
}

/* =========================================================================
   10. RSVP — sends the response through WhatsApp
   ========================================================================= */
function initRSVP() {
  const form = $('#rsvpForm'), sel = $('#gCount'), thanks = $('#thanks');
  for (let i = 1; i <= CONFIG.rsvp.maxGuests; i++) sel.insertAdjacentHTML('beforeend', `<option value="${i}">${i} ${i === 1 ? 'Guest' : 'Guests'}</option>`);
  $('#thanksMsg').textContent = CONFIG.rsvp.successMessage;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const err = $('[data-err="name"]');
    err.classList.toggle('show', !name);
    if (!name) { form.name.focus(); return; }

    const attend = form.attend.value === 'yes';
    const c = CONFIG.couple, ev = CONFIG.event;
    const first = c[c.displayOrder[0]], second = c[c.displayOrder[1]];
    const lines = [
      `*RSVP — ${first} & ${second}'s Engagement*`, '',
      `Name: ${name}`,
      `Attendance: ${attend ? 'Joyfully Accepts ✅' : 'Regretfully Declines'}`,
      attend ? `Guests: ${form.guests.value}` : null,
      `Date: ${$('[data-t="dateLong"]').textContent}`,
      form.message.value.trim() ? `Message: ${form.message.value.trim()}` : null
    ].filter(x => x !== null);
    const url = `https://wa.me/${CONFIG.rsvp.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;

    form.hidden = true; thanks.hidden = false; thanks.classList.add('in');
    thanks.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    window.open(url, '_blank', 'noopener');
  });
  form.name.addEventListener('input', () => $('[data-err="name"]').classList.remove('show'));
  $('#again').addEventListener('click', () => { thanks.hidden = true; form.hidden = false; form.reset(); });
}

/* =========================================================================
   11. NAVIGATION
   ========================================================================= */
function initNav() {
  const nav = $('#nav'), toggle = $('#navToggle'), menu = $('#navMenu');
  const setOpen = (v) => { nav.classList.toggle('open', v); toggle.setAttribute('aria-expanded', v); toggle.setAttribute('aria-label', v ? 'Close menu' : 'Open menu'); document.body.classList.toggle('menu-open', v); };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  // Smooth-scroll for every in-page link
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault(); setOpen(false);
    t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));

  // Compact bar after leaving the hero + current-section highlight
  const links = $$('a', menu);
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
}

/* =========================================================================
   INIT
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  bindContent();
  initStory();
  initGallery();
  initRSVP();
  initCountdown();
  initReveal();
  initNav();
  initGate();
});
