// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// ---------- Nav goes opaque once the page scrolls ----------
const navEl = document.querySelector('.nav');
function updateNavScrolled() {
  navEl.classList.toggle('scrolled', window.scrollY > 20);
}
updateNavScrolled();
window.addEventListener('scroll', updateNavScrolled, { passive: true });

// ---------- External link icon (reused for every card) ----------
const externalIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H8M17 7V16"/></svg>`;

// ---------- Build one card ----------
function buildCard(item) {
  const a = document.createElement('a');
  a.className = 'card' + (item.featured ? ' wide' : '');
  a.href = item.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';

  const ctaLabel = item.platform === 'LinkedIn' ? 'View on LinkedIn' : `Watch on ${item.platform}`;
  const meta = item.note ? `${item.format} · ${item.length} · ${item.note}` : `${item.format} · ${item.length}`;

  a.innerHTML = `
    <div class="card-media">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
    </div>
    <div class="card-body">
      <h3>${item.title}</h3>
      <p class="card-sub">${meta}</p>
      <span class="card-cta">${ctaLabel} ${externalIconSVG}</span>
    </div>
  `;
  return a;
}

// ---------- Load data and render grid ----------
// The grid's data-scope attribute controls what shows:
//   "selected" (default, used on the homepage teaser) — only items with selected:true
//   "all" (used on work.html) — every item
async function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  const scope = grid.dataset.scope || 'selected';
  try {
    const res = await fetch('portfolio-data.json');
    if (!res.ok) throw new Error('Could not load portfolio-data.json');
    let items = await res.json();

    if (scope === 'selected') items = items.filter(item => item.selected);

    // Featured items first, preserving the rest of the given order
    items.sort((a, b) => (b.featured === true) - (a.featured === true));

    grid.innerHTML = '';
    items.forEach(item => grid.appendChild(buildCard(item)));
  } catch (err) {
    grid.innerHTML = '<p style="color:#c7cdc7;">Could not load portfolio items. If you are viewing this file directly (file://), run a local server instead — see README.md.</p>';
    console.error(err);
  }
}

renderPortfolio();
