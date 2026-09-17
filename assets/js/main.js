// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

// ---------- Audience word rotators (homepage only) ----------
// Each element lists its own words in data-words="a,b,c" and cycles independently.
document.querySelectorAll('.audience-rotator-word').forEach(el => {
  const words = (el.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
  if (words.length < 2) return;
  let index = 0;
  setInterval(() => {
    el.classList.add('is-swapping');
    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.classList.remove('is-swapping');
    }, 300);
  }, 2000);
});

// ---------- External link icon (reused for every card) ----------
const externalIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H8M17 7V16"/></svg>`;

// ---------- Build one card ----------
function buildCard(item, featured = item.featured) {
  const a = document.createElement('a');
  a.className = 'card' + (featured ? ' wide' : '');
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
//   "all" (used on work.html) — every item
//   anything else (e.g. "selected", "katapult") — only items where item[scope] is true
//
// A scope can optionally override the default order and the shared
// "featured" hero card without affecting other pages, via two per-item
// fields named after the scope: `${scope}Order` (a number — lower first)
// and `${scope}Featured` (boolean — the one wide hero card for this grid).
// Both are optional. Without a scope-specific order, items sort by parsed
// view count from their "note" field (most-viewed first), falling back to
// the JSON array order for items with no view count on record.
function parseViewCount(item) {
  const match = item.note && item.note.match(/([\d,]+)\+?\s*views/i);
  return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
}

async function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  const scope = grid.dataset.scope || 'selected';
  try {
    const res = await fetch('/portfolio-data.json');
    if (!res.ok) throw new Error('Could not load portfolio-data.json');
    let items = await res.json();

    if (scope !== 'all') items = items.filter(item => item[scope]);

    const orderKey = `${scope}Order`;
    const featuredKey = `${scope}Featured`;
    const hasScopedFeatured = items.some(item => featuredKey in item);
    const isFeatured = item => hasScopedFeatured ? !!item[featuredKey] : !!item.featured;

    if (items.some(item => orderKey in item)) {
      items.sort((a, b) => (a[orderKey] ?? Infinity) - (b[orderKey] ?? Infinity));
    } else {
      items.sort((a, b) => (parseViewCount(b) ?? -Infinity) - (parseViewCount(a) ?? -Infinity));
    }
    // Featured item first, preserving the rest of the order set above
    items.sort((a, b) => isFeatured(b) - isFeatured(a));

    grid.innerHTML = '';
    items.forEach(item => grid.appendChild(buildCard(item, isFeatured(item))));
  } catch (err) {
    grid.innerHTML = '<p style="color:#c7cdc7;">Could not load portfolio items. If you are viewing this file directly (file://), run a local server instead — see README.md.</p>';
    console.error(err);
  }
}

renderPortfolio();
