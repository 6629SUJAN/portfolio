/* =============================================
   SUJAN NEPAL — PORTFOLIO JS
   Three.js hero + cursor + counters + interactions
============================================= */

const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

/* ===== LOADER ===== */
window.addEventListener('load', () => {
  const delay = prefersReduce ? 250 : 2000;
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }, delay);
});

/* ===== CUSTOM CURSOR ===== */
(function initCursor() {
  if (prefersReduce) return;
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;

  let dotX = 0, dotY = 0, outX = 0, outY = 0;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX; dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
  }, { passive: true });

  function animateOutline() {
    outX += (dotX - outX) * 0.15;
    outY += (dotY - outY) * 0.15;
    outline.style.left = outX + 'px';
    outline.style.top = outY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Enlarge cursor on interactive elements
  const interactive = 'a, button, [role="button"], input, textarea, .skill-card, .project-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactive)) {
      dot.style.transform = 'translate(-50%, -50%) scale(2)';
      outline.style.width = '56px';
      outline.style.height = '56px';
      outline.style.borderColor = 'rgba(6,182,212,0.7)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactive)) {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      outline.style.width = '36px';
      outline.style.height = '36px';
      outline.style.borderColor = 'rgba(6,182,212,0.5)';
    }
  });
})();

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !navLinks?.classList.contains('open')) return;
  navLinks.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
});

/* ===== BACK TO TOP ===== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== THREE.JS HERO ===== */
(function initThree() {
  try {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;
    if (prefersReduce) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const hero = document.getElementById('hero') || canvas.parentElement;
    const sizeFor = () => {
      const rect = (hero || canvas).getBoundingClientRect();
      return { w: Math.max(1, Math.floor(rect.width)), h: Math.max(1, Math.floor(rect.height)) };
    };
    const initial = sizeFor();
    renderer.setSize(initial.w, initial.h, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, initial.w / initial.h, 0.1, 100);
    camera.position.set(0, 0.2, 6);

    // Background plane
    const bgGeo = new THREE.PlaneGeometry(20, 20);
    const bgMat = new THREE.MeshBasicMaterial({ color: 0x050514, transparent: true, opacity: 0.35 });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.position.z = -10;
    scene.add(bg);

    // Wireframe torus knot
    const knotGeo = new THREE.TorusKnotGeometry(1.25, 0.38, 160, 24);
    const knotMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, wireframe: true, opacity: 0.35, transparent: true });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.y = 0.1;
    scene.add(knot);

    // Rings
    const torusGeo = new THREE.TorusGeometry(2.2, 0.02, 16, 80);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, opacity: 0.25, transparent: true });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 4;
    scene.add(torus);

    const torusGeo2 = new THREE.TorusGeometry(2.8, 0.015, 16, 80);
    const torusMat2 = new THREE.MeshBasicMaterial({ color: 0xf472b6, opacity: 0.15, transparent: true });
    const torus2 = new THREE.Mesh(torusGeo2, torusMat2);
    torus2.rotation.x = -Math.PI / 3;
    scene.add(torus2);

    // Star field
    const pointsCount = 900;
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    const palette = [new THREE.Color('#7c3aed'), new THREE.Color('#06b6d4'), new THREE.Color('#f472b6'), new THREE.Color('#a78bfa')];
    for (let i = 0; i < pointsCount; i++) {
      const r = 4.5 * Math.pow(Math.random(), 0.55);
      const theta = Math.random() * Math.PI * 2;
      positions[i*3] = Math.cos(theta) * r;
      positions[i*3+1] = (Math.random() - 0.5) * 2.6;
      positions[i*3+2] = Math.sin(theta) * r - 2.0;
      const c = palette[(Math.random() * palette.length) | 0];
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.02, vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0x7c3aed, 2);
    dLight.position.set(5, 5, 5);
    scene.add(dLight);
    const dLight2 = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dLight2.position.set(-5, -5, 5);
    scene.add(dLight2);

    let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    let animId;
    let last = performance.now();
    function animate() {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now * 0.001;
      mouseX += (targetX - mouseX) * (1 - Math.pow(0.001, dt));
      mouseY += (targetY - mouseY) * (1 - Math.pow(0.001, dt));
      knot.rotation.x = t * 0.25 + mouseY * 0.25;
      knot.rotation.y = t * 0.3 + mouseX * 0.25;
      torus.rotation.z = t * 0.2;
      torus.rotation.x = Math.PI / 4 + mouseY * 0.1;
      torus2.rotation.z = -t * 0.15;
      points.rotation.y = -t * 0.05;
      points.rotation.x = t * 0.02;
      renderer.render(scene, camera);
    }
    const start = () => { if (!animId) animate(); };
    const stop = () => { if (animId) cancelAnimationFrame(animId); animId = undefined; };
    start();

    const onResize = () => {
      const { w, h } = sizeFor();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    window.addEventListener('pagehide', () => {
      stop();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      [pGeo, pMat, bgGeo, bgMat, knotGeo, knotMat, torusGeo, torusMat, torusGeo2, torusMat2].forEach(o => o.dispose?.());
    });
  } catch (err) {
    console.warn('Hero 3D unavailable:', err);
  }
})();

/* ===== PARTICLES ===== */
(function spawnParticles() {
  if (prefersReduce) return;
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#7c3aed', '#06b6d4', '#f472b6', '#a78bfa'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `width:${size}px;height:${size}px;background:${color};left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s;box-shadow:0 0 ${size*2}px ${color};`;
    container.appendChild(p);
  }
})();

/* ===== TYPING ANIMATION ===== */
(function typeEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = [
    'BIT Student | 6th Semester',
    'Java + SQL · Medical Management System ☕',
    'Learning Web Development 🌐',
    'Arduino Enthusiast 🤖',
    'Photography Lover 📷',
    'Curious about Tech 🚀',
  ];
  if (prefersReduce) { el.textContent = phrases[0]; return; }
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function type() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.substring(0, ++charIndex);
      if (charIndex === current.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      el.textContent = current.substring(0, --charIndex);
      if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 45 : 75);
  }
  setTimeout(type, 1400);
})();

/* ===== STAT COUNTERS ===== */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      let current = 0;
      const increment = target / 40;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
        else el.textContent = Math.floor(current);
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => observer.observe(el));
})();

/* ===== SKILL BARS ===== */
(function animateSkills() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
})();

/* ===== SCROLL ANIMATIONS ===== */
(function scrollAnim() {
  const items = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  items.forEach(el => observer.observe(el));
})();

/* ===== ACTIVE NAV ===== */
(function activeNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  let raf = 0;
  function update() {
    raf = 0;
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 130) current = sec.id; });
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  update();
})();

/* ===== EMAILJS ===== */
(function initEmailJS() {
  const publicKey = 'rWdAnM4Fd5VvqVRt1';
  if (publicKey && publicKey !== 'YOUR_PUBLIC_KEY_HERE') emailjs.init(publicKey);
})();

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  const btn = this.querySelector('button[type="submit"]');
  const btnText = btn?.querySelector('.btn-text');

  const formData = {
    from_name: this.querySelector('input[name="name"]').value,
    from_email: this.querySelector('input[name="email"]').value,
    message: this.querySelector('textarea[name="message"]').value,
    to_email: 'sujann045@gmail.com'
  };

  if (btn) { btn.disabled = true; }
  if (btnText) btnText.textContent = 'Sending...';
  if (msg) { msg.textContent = ''; msg.style.color = 'var(--neon2)'; }

  emailjs.send('gmail', 'template_portfolio', formData)
    .then(() => {
      if (msg) { msg.textContent = '✓ Message sent! I\'ll reply soon.'; msg.style.color = '#22c55e'; }
      this.reset();
      setTimeout(() => { if (msg) msg.textContent = ''; }, 6000);
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      if (msg) { msg.textContent = '✗ Failed to send. Email me directly: sujann045@gmail.com'; msg.style.color = 'var(--neon3)'; }
      setTimeout(() => { if (msg) msg.textContent = ''; }, 7000);
    })
    .finally(() => {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
    });
});
