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

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.contact-submit');
  const formData = new FormData(contactForm);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  contactStatus.textContent = '';
  contactStatus.className = 'contact-status';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      submitBtn.textContent = '✓ Message Sent!';
      contactStatus.textContent = "Thanks! I'll get back to you soon.";
      contactStatus.classList.add('success');
      contactForm.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      submitBtn.textContent = 'Send Message';
      contactStatus.textContent = (data && data.errors)
        ? data.errors.map(err => err.message).join(', ')
        : 'Something went wrong. Please try again.';
      contactStatus.classList.add('error');
    }
  } catch (err) {
    submitBtn.textContent = 'Send Message';
    contactStatus.textContent = 'Network error. Please try again.';
    contactStatus.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    setTimeout(() => { submitBtn.textContent = 'Send Message'; }, 3000);
  }
});
