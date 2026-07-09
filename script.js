/* ============================================================
   Senthil Nursing Home — shared site script
   Used across all pages: index, about, doctors, specialities,
   services, resources, community, contact
   ============================================================ */

// ---------- Active nav link (by current filename) ----------
(function highlightActiveNav(){
  let current = location.pathname.split('/').pop();
  if(current === '' ) current = 'index.html';
  document.querySelectorAll('.nav-links a[href], .mobile-panel a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if(href === current){
      a.classList.add('active');
    }
  });
})();

// ---------- Mobile menu ----------
const burger = document.getElementById('burgerBtn');
const mobilePanel = document.getElementById('mobilePanel');
if(burger && mobilePanel){
  burger.addEventListener('click', () => mobilePanel.classList.toggle('open'));
  // close menu when a link is tapped
  mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobilePanel.classList.remove('open')));
}

// ---------- Scroll progress bar (vitals strip under nav) ----------
const vitalsFill = document.getElementById('vitalsFill');
if(vitalsFill){
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const denom = (h.scrollHeight - h.clientHeight) || 1;
    const pct = (h.scrollTop / denom) * 100;
    vitalsFill.style.width = Math.min(100, Math.max(0,pct)) + '%';
  });
}

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.14});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Animated counters (home page stats) ----------
const counterEls = document.querySelectorAll('.stat .num[data-count]');
if(counterEls.length){
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = Math.max(1, Math.round(target/60));
        const timer = setInterval(() => {
          cur += step;
          if(cur >= target){
            cur = target;
            clearInterval(timer);
            el.innerHTML = cur.toLocaleString('en-IN') + '<span class="suffix">'+suffix+'</span>';
          } else {
            el.textContent = cur.toLocaleString('en-IN');
          }
        }, 22);
        counterObserver.unobserve(el);
      }
    });
  }, {threshold:.5});
  counterEls.forEach(el => counterObserver.observe(el));
}

// ---------- Testimonial carousel (home page) ----------
const slides = document.querySelectorAll('.testi-slide');
const testiNav = document.getElementById('testiNav');
if(slides.length && testiNav){
  let testiIdx = 0;
  slides.forEach((s,i) => {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i===0 ? ' active' : '');
    dot.addEventListener('click', () => setTesti(i));
    testiNav.appendChild(dot);
  });
  function setTesti(i){
    slides.forEach((s,idx) => s.classList.toggle('active', idx===i));
    testiNav.querySelectorAll('.testi-dot').forEach((d,idx) => d.classList.toggle('active', idx===i));
    testiIdx = i;
  }
  setInterval(() => { setTesti((testiIdx+1) % slides.length); }, 6000);
}

// ---------- Specialities tabs (specialities page) ----------
const specTabs = document.querySelectorAll('.spec-tab');
if(specTabs.length){
  function activateTab(tabName){
    document.querySelectorAll('.spec-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    document.querySelectorAll('.spec-detail').forEach(d => d.classList.toggle('active', d.id === 'detail-'+tabName));
  }
  specTabs.forEach(tab => tab.addEventListener('click', () => {
    activateTab(tab.dataset.tab);
    history.replaceState(null, '', '#'+tab.dataset.tab);
  }));
  // Deep link support: specialities.html#diabetology etc.
  const hash = location.hash.replace('#','');
  if(hash && document.getElementById('detail-'+hash)){
    activateTab(hash);
  }
}

// ---------- FAQ accordion (resources page) ----------
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if(!q) return;
  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

// ---------- Resource filter + search (resources page) ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const blogCards = document.querySelectorAll('.blog-card');
const resourceSearch = document.getElementById('resourceSearch');
if(filterBtns.length && blogCards.length){
  function applyResourceFilter(){
    const activeBtn = document.querySelector('.filter-btn.active');
    const activeCat = activeBtn ? activeBtn.dataset.cat : 'all';
    const q = resourceSearch ? resourceSearch.value.trim().toLowerCase() : '';
    blogCards.forEach(card => {
      const matchesCat = activeCat === 'all' || card.dataset.cat === activeCat;
      const matchesQ = !q || card.dataset.title.includes(q);
      card.style.display = (matchesCat && matchesQ) ? '' : 'none';
    });
  }
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyResourceFilter();
  }));
  if(resourceSearch) resourceSearch.addEventListener('input', applyResourceFilter);
}

// ---------- Appointment form (contact page) ----------
// NOTE: form submission is now handled by the Supabase script
// at the bottom of contact.html, which actually saves the
// appointment to the database. Do not add a submit handler
// for #apptForm here — it would show a fake success message
// without saving anything.

// ---------- Footer year ----------
const yrEl = document.getElementById('yr');
if(yrEl) yrEl.textContent = new Date().getFullYear();
