/* ============================================================
   M&A Motors Inc — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ─────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  const scrollTop = document.querySelector('.scroll-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (scrollTop) scrollTop.classList.toggle('visible', y > 400);
  }, { passive: true });

  if (scrollTop) {
    scrollTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* ── Mobile nav toggle ────────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);

      // Animate hamburger lines
      const spans = toggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      });
    });
  }

  /* ── Fade-in on scroll ────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));

  /* ── Active nav link ──────────────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Inventory filtering (inventory.html only) ────────── */
  const filterMake  = document.getElementById('filterMake');
  const filterPrice = document.getElementById('filterPrice');
  const filterType  = document.getElementById('filterType');
  const searchInput = document.getElementById('searchInput');
  const grid        = document.getElementById('inventoryGrid');
  const countEl     = document.getElementById('resultCount');

  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.vehicle-card'));

    function applyFilters() {
      const make  = filterMake  ? filterMake.value.toLowerCase()  : '';
      const price = filterPrice ? parseInt(filterPrice.value) || 0 : 0;
      const type  = filterType  ? filterType.value.toLowerCase()  : '';
      const query = searchInput ? searchInput.value.toLowerCase()  : '';

      let visible = 0;

      cards.forEach(card => {
        const cardMake  = (card.dataset.make  || '').toLowerCase();
        const cardPrice = parseInt(card.dataset.price) || 0;
        const cardType  = (card.dataset.type  || '').toLowerCase();
        const cardText  = card.textContent.toLowerCase();

        const matchMake  = !make  || cardMake.includes(make);
        const matchPrice = !price || cardPrice <= price;
        const matchType  = !type  || cardType.includes(type);
        const matchQuery = !query || cardText.includes(query);

        const show = matchMake && matchPrice && matchType && matchQuery;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      if (countEl) {
        countEl.innerHTML = `Prikazano <strong>${visible}</strong> od <strong>${cards.length}</strong> vozila`;
      }

      // No results message
      let noResult = grid.querySelector('.no-results');
      if (visible === 0) {
        if (!noResult) {
          noResult = document.createElement('div');
          noResult.className = 'no-results';
          noResult.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p>Nema vozila koja odgovaraju vašoj pretrazi. Pokušajte promijeniti filtere.</p>`;
          grid.appendChild(noResult);
        }
        noResult.style.display = '';
      } else if (noResult) {
        noResult.style.display = 'none';
      }
    }

    [filterMake, filterPrice, filterType].forEach(el => {
      if (el) el.addEventListener('change', applyFilters);
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    applyFilters();
  }

  /* ── Contact form ─────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--accent)';
          valid = false;
          field.addEventListener('input', () => field.style.borderColor = '', { once: true });
        }
      });

      if (!valid) return;

      // Show success state
      const formInner = contactForm.querySelector('.form-inner');
      const success   = contactForm.querySelector('.form-success');
      if (formInner && success) {
        formInner.style.display = 'none';
        success.style.display   = 'block';
      }
    });
  }

  /* ── Number counter animation ─────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target) || 0;
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    }, 16);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObs.observe(c));
  }

  /* ── Translate spec labels & buttons (inventory page) ── */
  const labelMap = {
    'Engine': 'Motor', 'Mileage': 'Kilometraža', 'Trans.': 'Mjenjač',
    'Exterior': 'Boja', 'Interior': 'Enterijer', 'Drive': 'Pogon'
  };
  document.querySelectorAll('.spec-label').forEach(el => {
    const t = labelMap[el.textContent.trim()];
    if (t) el.textContent = t;
  });
  document.querySelectorAll('.view-btn').forEach(el => {
    const txt = el.textContent.trim();
    if (txt === 'Inquire') el.textContent = 'Upit';
    else if (txt === 'View Details') el.textContent = 'Detalji';
  });

});
