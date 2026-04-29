/* ============================================================
   Sebastian Beca — script.js
   · Oscilloscope canvas background
   · Active nav link on scroll
   · Mobile nav toggle
   ============================================================ */

// === Canvas oscilloscope background ========================

const canvas = document.getElementById('bg');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let t = 0;

function wave(yRatio, f1, f2, s1, s2, a1, a2, color, lineWidth = 1) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth   = lineWidth;
  const h = canvas.height;
  const w = canvas.width;
  for (let x = 0; x <= w; x += 2) {
    const nx = x / w;
    const y  = yRatio * h
      + Math.sin(nx * f1 + t * s1) * a1
      + Math.sin(nx * f2 + t * s2) * a2;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawGrid() {
  const step = 80;
  ctx.strokeStyle = 'rgba(90, 70, 180, 0.04)';
  ctx.lineWidth   = 1;
  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
  // centre crosshair
  ctx.strokeStyle = 'rgba(124, 111, 247, 0.055)';
  ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  // Violet waves — different frequencies & speeds for organic feel
  wave(0.20, 5.5,  2.2, 0.32, 0.12,  72, 38, 'rgba(124, 111, 247, 0.13)', 1.2);
  wave(0.50, 7.0,  3.5, 0.50, 0.20,  52, 26, 'rgba(124, 111, 247, 0.07)', 1.0);
  wave(0.80, 4.5,  1.8, 0.22, 0.16,  80, 32, 'rgba(124, 111, 247, 0.09)', 1.0);

  // Cyan accent — prominent, fast
  wave(0.50, 9.0,  4.0, 0.65, 0.28,  38, 18, 'rgba(34, 211, 238, 0.18)', 2.0);
  // Second cyan trace, offset
  wave(0.35, 11.0, 5.0, 0.80, 0.38,  28, 14, 'rgba(34, 211, 238, 0.09)', 1.2);

  t += 0.00345;
  requestAnimationFrame(draw);
}

draw();


// === Active nav on scroll ==================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(l => l.classList.remove('active'));
    const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, {
  threshold:  0.35,
  rootMargin: '-5% 0px -55% 0px',
});

sections.forEach(s => sectionObserver.observe(s));


// === Mobile nav toggle =====================================

const menuBtn = document.getElementById('menuBtn');
const sidenav = document.getElementById('sidenav');

function openNav() {
  sidenav.classList.add('open');
  document.body.classList.add('nav-open');
  menuBtn.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  sidenav.classList.remove('open');
  document.body.classList.remove('nav-open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  sidenav.classList.contains('open') ? closeNav() : openNav();
});

// Close when a nav link is tapped
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 700) closeNav();
  });
});

// Close when tapping the dim overlay
document.body.addEventListener('click', e => {
  if (
    document.body.classList.contains('nav-open') &&
    !sidenav.contains(e.target) &&
    e.target !== menuBtn
  ) closeNav();
});
