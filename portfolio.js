const canvas = document.getElementById('code-canvas');
const ctx = canvas.getContext('2d');
let cols = [], fontSize = 14;
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
    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, (y-1) * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) cols[i] = 0;
    cols[i]++;
  });
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

const words = ['Aspiring Software Engineer','Tech Enthusiast','Problem Solver'];
let wi=0, ci=0, deleting=false;
const twEl = document.getElementById('typewriter-text');
function type() {
  const word = words[wi];
  if (!deleting) {
    twEl.textContent = word.slice(0, ci+1); ci++;
    if (ci === word.length) { setTimeout(()=>{ deleting=true; type(); }, 1800); return; }
  } else {
    twEl.textContent = word.slice(0, ci-1); ci--;
    if (ci === 0) { deleting=false; wi=(wi+1)%words.length; }
  }
  setTimeout(type, deleting ? 42 : 78);
}
setTimeout(type, 1000);

const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.card').forEach(el => obs.observe(el));

const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.padding = scrollY > 60 ? '0.6rem 4rem' : '1rem 4rem';
});

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
    setTimeout(() => {
      submitBtn.textContent = 'Send Message';
    }, 3000);
  }
});

document.querySelectorAll('.skills-grid .card').forEach((c,i) => c.style.transitionDelay = `${i*0.06}s`);
document.querySelectorAll('.project-grid .card').forEach((c,i) => c.style.transitionDelay = `${i*0.1}s`);
document.querySelectorAll('.edu-grid .card').forEach((c,i) => c.style.transitionDelay = `${i*0.08}s`);
document.querySelectorAll('.ach-grid .card').forEach((c,i) => c.style.transitionDelay = `${i*0.08}s`);
