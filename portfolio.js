const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Matrix background ---------- */
const canvas = document.getElementById('code-canvas');
const ctx = canvas.getContext('2d');
let cols = [];
const fontSize = 14;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Array(Math.floor(canvas.width / fontSize)).fill(1);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{}[]()<>/=+-*&^%$#@!;:.~';
function drawMatrix() {
  ctx.fillStyle = 'rgba(2,12,20,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + 'px monospace';
  cols.forEach((y, i) => {
    const x = i * fontSize;
    ctx.fillStyle = 'rgba(186,230,253,0.85)';
    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y * fontSize);
    ctx.fillStyle = 'rgba(56,189,248,0.45)';
    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, (y - 1) * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) cols[i] = 0;
    cols[i]++;
  });
  requestAnimationFrame(drawMatrix);
}
if (!reduceMotion) drawMatrix();

/* ---------- Typewriter ---------- */
const words = ['Aspiring Software Engineer', 'Tech Enthusiast', 'Problem Solver'];
const twEl = document.getElementById('typewriter-text');
let wi = 0, ci = 0, deleting = false;

function type() {
  const word = words[wi];
  if (!deleting) {
    twEl.textContent = word.slice(0, ci + 1); ci++;
    if (ci === word.length) { setTimeout(() => { deleting = true; type(); }, 1800); return; }
  } else {
    twEl.textContent = word.slice(0, ci - 1); ci--;
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, deleting ? 42 : 78);
}
if (reduceMotion) twEl.textContent = words[0];
else setTimeout(type, 1000);

/* ---------- Card reveal on scroll ---------- */
const obs = new IntersectionObserver((entries, observer) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.card').forEach(el => obs.observe(el));

/* ---------- Nav: shrink on scroll (class, so media-query padding still applies) ---------- */
const nav = document.querySelector('nav');
function updateNav() { nav.classList.toggle('scrolled', window.scrollY > 60); }
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('hamburger');
const mmenu = document.getElementById('mobile-menu');

function setMenu(open) {
  burger.classList.toggle('open', open);
  mmenu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!mmenu.classList.contains('open')));
mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
window.addEventListener('resize', () => { if (window.innerWidth > 600) setMenu(false); });

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Contact form ---------- */
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const submitBtn = contactForm.querySelector('.contact-submit');

function showStatus(msg, type) {
  contactStatus.textContent = msg;
  contactStatus.className = 'contact-status' + (type ? ' ' + type : '');
}

function resetButtonLater() {
  setTimeout(() => { submitBtn.textContent = 'Send Message'; }, 3000);
}

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Browsers often block form requests from pages opened as file://
  if (location.protocol === 'file:') {
    showStatus('The form cannot send from a file opened directly. Run the site on a local server or deploy it, then try again.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  showStatus('');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      submitBtn.textContent = '✓ Message Sent!';
      showStatus("Thanks! I'll get back to you soon.", 'success');
      contactForm.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      console.error('Formspree error', response.status, data);

      let msg;
      if (data && Array.isArray(data.errors) && data.errors.length) {
        msg = data.errors.map(err => err.message).join(', ');
      } else if (data && data.error) {
        msg = data.error;
      } else if (response.status === 404) {
        msg = 'The contact form was not found. Please try again later.';
      } else if (response.status === 429) {
        msg = 'Too many messages sent. Please wait a few minutes and try again.';
      } else {
        msg = 'Could not send your message (error ' + response.status + '). Please try again.';
      }
      submitBtn.textContent = 'Send Message';
      showStatus(msg, 'error');
    }
  } catch (err) {
    console.error('Network error', err);
    submitBtn.textContent = 'Send Message';
    showStatus('Network error. Check your connection or disable ad blockers, then try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    resetButtonLater();
  }
});
