(() => {
  'use strict';

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => loader.classList.add('is-hidden'), 400);
    }
  });

  /* ---------- Glass save/bookmark buttons ---------- */
  const SAVE_KEY = 'surcin-saved';
  const savedIds = new Set(JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'));
  const saveButtons = document.querySelectorAll('.glass-save');
  saveButtons.forEach(btn => {
    const id = btn.dataset.saveId;
    if (savedIds.has(id)) btn.classList.add('is-saved');
    btn.addEventListener('click', () => {
      if (savedIds.has(id)) { savedIds.delete(id); btn.classList.remove('is-saved'); }
      else { savedIds.add(id); btn.classList.add('is-saved'); }
      localStorage.setItem(SAVE_KEY, JSON.stringify([...savedIds]));
    });
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    const scrolled = window.scrollY > 30;
    header?.classList.toggle('is-scrolled', scrolled);
    backToTop?.classList.toggle('is-visible', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  hamburger?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Cursor glow ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('sr-RS');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('sr-RS');
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Animated progress bars ---------- */
  const progressBars = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.dataset.progress || 0;
        requestAnimationFrame(() => { bar.style.width = `${value}%`; });
        progressObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  progressBars.forEach(bar => progressObserver.observe(bar));

  /* ---------- News filter ---------- */
  const filterChips = document.querySelectorAll('.filter-chip');
  const newsCards = document.querySelectorAll('.news-card');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const filter = chip.dataset.filter;
      newsCards.forEach(card => {
        const match = filter === 'sve' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Load more (demo) ---------- */
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn?.addEventListener('click', () => {
    loadMoreBtn.textContent = 'Nema više vesti za prikaz';
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.opacity = '0.6';
    loadMoreBtn.style.cursor = 'default';
  });

  /* ---------- Service tabs ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('is-active'));
      tabPanels.forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`)?.classList.add('is-active');
    });
  });

  /* ---------- Countdown timer ---------- */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const target = new Date(countdownEl.dataset.target).getTime();
    const daysEl = countdownEl.querySelector('[data-cd="days"]');
    const hoursEl = countdownEl.querySelector('[data-cd="hours"]');
    const minutesEl = countdownEl.querySelector('[data-cd="minutes"]');
    const secondsEl = countdownEl.querySelector('[data-cd="seconds"]');

    const pad = (n) => String(n).padStart(2, '0');

    const tick = () => {
      const diff = Math.max(target - Date.now(), 0);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
      if (diff === 0) clearInterval(timer);
    };
    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ---------- Live ticker content ---------- */
  const tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    const items = [
      '📢 Sledeći veliki događaj: Surčinski letnji sajam i vašar — 18. jul',
      '🚧 Rekonstrukcija glavne saobraćajnice u centru — saobraćaj preusmeren',
      '💧 Planirani prekid vodosnabdevanja 3. jula u Vojvođanskoj ulici',
      '🏗️ Izgradnja obilaznice: projekat je 68% završen',
      '🎉 Najava: Dani Surčina, jubilarno 15. izdanje, septembar 2026.'
    ];
    const html = items.map(i => `<span>${i}</span>`).join('');
    tickerTrack.innerHTML = html + html; // duplicate for seamless loop
  }

  /* ---------- Newsletter form (demo, no backend) ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterSuccess?.classList.add('is-visible');
    newsletterForm.reset();
    setTimeout(() => newsletterSuccess?.classList.remove('is-visible'), 4000);
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
