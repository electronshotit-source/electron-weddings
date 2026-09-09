// ===================================================================
// Electron Weddings — site scripts
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {

  /* preloader */
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    setTimeout(() => pre.classList.add('loaded'), 250);
  });
  // fallback in case 'load' already fired
  setTimeout(() => {
    document.getElementById('preloader')?.classList.add('loaded');
  }, 2000);

  /* footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* header scroll state */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* portfolio filter */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('hide', !match);
      });
    });
  });

  /* lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });
  const closeLightbox = () => lightbox.classList.remove('open');
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* testimonial carousel */
  const testimonials = document.querySelectorAll('.testimonial');
  const dotsWrap = document.getElementById('testimonialDots');
  let current = 0;

  if (testimonials.length && dotsWrap) {
    testimonials.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showTestimonial(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('span');

    function showTestimonial(i) {
      testimonials[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      testimonials[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function nextTestimonial() {
      showTestimonial((current + 1) % testimonials.length);
    }
    setInterval(nextTestimonial, 5500);
  }

  /* contact form (no backend — friendly confirmation + mailto fallback) */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const wdate = document.getElementById('wdate').value;
    const venue = document.getElementById('venue').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`Wedding inquiry from ${fname} ${lname}`);
    const body = encodeURIComponent(
      `Name: ${fname} ${lname}\nEmail: ${email}\nPhone: ${phone}\nWedding date: ${wdate || 'TBD'}\nVenue: ${venue || 'TBD'}\n\n${message}`
    );
    status.textContent = 'Opening your email client to send this inquiry…';
    window.location.href = `mailto:bookelectronweddings@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      status.textContent = 'Thank you! If your email app did not open, reach us directly at bookelectronweddings@gmail.com.';
      form.reset();
    }, 800);
  });

  /* reveal-on-scroll for section headers / cards */
  const revealTargets = document.querySelectorAll('.gallery-item, .price-card, .insta-tile');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });
});
