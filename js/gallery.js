// ===================================================================
// Electron Weddings — full gallery page (renders GALLERY_IMAGES from
// js/gallery-data.js in batches, with a lightbox that can page through
// the entire set regardless of how much has been "loaded" on screen)
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  const IMG_BASE = 'images/web/';
  const BATCH_SIZE = 24;

  const grid = document.getElementById('fullGallery');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const countEl = document.getElementById('galleryCount');
  if (!grid || typeof GALLERY_IMAGES === 'undefined') return;

  if (countEl) countEl.textContent = GALLERY_IMAGES.length;

  let shown = 0;

  function renderBatch() {
    const next = GALLERY_IMAGES.slice(shown, shown + BATCH_SIZE);
    next.forEach((filename, i) => {
      const globalIndex = shown + i;
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      figure.dataset.index = globalIndex;

      const img = document.createElement('img');
      img.src = IMG_BASE + filename;
      img.alt = `Electron Weddings photograph ${globalIndex + 1}`;
      img.loading = 'lazy';
      img.addEventListener('click', () => openLightbox(globalIndex));

      const caption = document.createElement('figcaption');
      caption.textContent = 'View Fullsize';

      figure.appendChild(img);
      figure.appendChild(caption);
      grid.appendChild(figure);
    });

    shown += next.length;

    if (shown >= GALLERY_IMAGES.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.textContent = `Load More (${GALLERY_IMAGES.length - shown} remaining)`;
    }
  }

  loadMoreBtn?.addEventListener('click', renderBatch);
  renderBatch();

  /* ---------- lightbox with prev/next across the FULL set ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCount = document.getElementById('lightboxCount');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
  }
  function updateLightbox() {
    const filename = GALLERY_IMAGES[currentIndex];
    lightboxImg.src = IMG_BASE + filename;
    lightboxImg.alt = `Electron Weddings photograph ${currentIndex + 1}`;
    if (lightboxCount) lightboxCount.textContent = `${currentIndex + 1} / ${GALLERY_IMAGES.length}`;
  }
  function showPrev() {
    currentIndex = (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    updateLightbox();
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
    updateLightbox();
  }
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
});
