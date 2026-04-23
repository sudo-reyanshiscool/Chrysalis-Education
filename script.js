// ========================================================
//  CHRYSALIS — interactions
// ========================================================

// ---------- Custom cursor (quill dot + ring) ----------
const cursor = document.createElement("div");
cursor.className = "cursor";
cursor.innerHTML = `<div class="cursor__dot"></div><div class="cursor__ring"></div>`;
document.body.appendChild(cursor);

const dot = cursor.querySelector(".cursor__dot");
const ring = cursor.querySelector(".cursor__ring");

let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

window.addEventListener("mousemove", (e) => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx}px, ${my}px)`;
});

// ring lerps toward the mouse for a lagging feel
function cursorLoop() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  ring.style.transform = `translate(${rx}px, ${ry}px)`;
  requestAnimationFrame(cursorLoop);
}
cursorLoop();

// hover state on interactive elements
document.querySelectorAll("a, button, .service, input, textarea, label").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
});

window.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
window.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));

// ---------- Sparkle trail (continuous) ----------
const SPARKLE_GLYPHS = ["✦", "✧", "✨", "·"];
const SPARKLE_COLORS = ["#c489dc", "#e0b8ec", "#9a6fc4", "#fff0ff"];
let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
let cursorActive = false;
window.addEventListener("mousemove", (e) => {
  cursorX = e.clientX; cursorY = e.clientY;
  cursorActive = true;
});
window.addEventListener("mouseleave", () => { cursorActive = false; });
window.addEventListener("mouseenter", () => { cursorActive = true; });

setInterval(() => {
  if (!cursorActive) return;
  spawnSparkle(
    cursorX + (Math.random() - 0.5) * 18,
    cursorY + (Math.random() - 0.5) * 18
  );
}, 55);

function spawnSparkle(x, y) {
  const s = document.createElement("span");
  s.className = "sparkle-trail";
  s.textContent = SPARKLE_GLYPHS[Math.floor(Math.random() * SPARKLE_GLYPHS.length)];
  s.style.left = x + "px";
  s.style.top = y + "px";
  s.style.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
  s.style.setProperty("--dx", ((Math.random() - 0.5) * 30) + "px");
  s.style.setProperty("--dy", (10 + Math.random() * 25) + "px");
  s.style.setProperty("--rot", ((Math.random() - 0.5) * 180) + "deg");
  s.style.setProperty("--scale", (0.5 + Math.random() * 0.8));
  s.style.setProperty("--life", "900ms");
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 900);
}

// ---------- Click burst (books fly outward) ----------
window.addEventListener("click", (e) => {
  // avoid form controls
  if (e.target.closest("input, textarea, button[type=submit]")) return;
  burst(e.clientX, e.clientY);
  ripple(e.clientX, e.clientY);
});

const BUTTERFLY_GLYPHS = ["🦋", "🦋", "🦋"];
function burst(x, y) {
  const n = 10;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 80 + Math.random() * 80;
    const b = document.createElement("span");
    b.className = "butterfly-burst";
    b.textContent = BUTTERFLY_GLYPHS[Math.floor(Math.random() * BUTTERFLY_GLYPHS.length)];
    b.style.left = x + "px";
    b.style.top = y + "px";
    b.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    b.style.setProperty("--ty", Math.sin(angle) * dist + "px");
    b.style.setProperty("--rot", (Math.random() - 0.5) * 360 + "deg");
    b.style.setProperty("--delay", (Math.random() * 120) + "ms");
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1600);
  }
}

function ripple(x, y) {
  const r = document.createElement("span");
  r.className = "click-ripple";
  r.style.left = x + "px";
  r.style.top = y + "px";
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
}

// ---------- Page load overlay ----------
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// ---------- Reveal on scroll (with per-child stagger) ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- Scroll: parallax + nav shadow (rAF-throttled) ----------
const heroBg = document.querySelector(".hero__bg");
const heroContent = document.querySelector(".hero__content");
const nav = document.querySelector(".nav");
let scrollTicking = false;
let lastScrollY = -1;
function onScrollFrame() {
  scrollTicking = false;
  const y = window.scrollY;
  if (y === lastScrollY) return;
  lastScrollY = y;
  if (nav) nav.classList.toggle("scrolled", y > 40);
  const vh = window.innerHeight;
  if (y < vh) {
    if (heroBg) heroBg.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(${1 + y * 0.0004})`;
    if (heroContent) {
      heroContent.style.transform = `translate3d(0, ${y * 0.2}px, 0)`;
      heroContent.style.opacity = String(Math.max(0, 1 - y / (vh * 0.7)));
    }
  }
}
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScrollFrame);
  }
}, { passive: true });

// ---------- Magnetic buttons ----------
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

// ---------- Count-up stats ----------
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + (p === 1 ? "+" : "");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll(".stat__num").forEach((el) => countIO.observe(el));

// ---------- Text splitting for hero (already in HTML) ----------
// (handled via CSS + class "word")

// ---------- Page transition on nav ----------
document.querySelectorAll('a[href$=".html"], a.nav__brand').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => { window.location.href = href; }, 500);
  });
});

// ---------- Contact form (local only) ----------
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
if (form) form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (!data.get("name") || !data.get("email") || !data.get("message")) {
    status.textContent = "Kindly complete the required fields.";
    status.style.color = "#9a3a2b";
    return;
  }
  status.style.color = "";
  status.textContent = "Thank you — your message has been received.";
  // celebratory burst at the button
  const btn = form.querySelector("button");
  const r = btn.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);
  form.reset();
});

// ---------- Year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Floating WhatsApp button ----------
const wa = document.createElement("a");
wa.className = "wa-float";
wa.href = "https://wa.me/919810954868?text=Hello%20Chrysalis%2C%20I'd%20like%20to%20enquire%20about%20tutoring.";
wa.target = "_blank";
wa.rel = "noopener";
wa.setAttribute("aria-label", "Chat on WhatsApp");
wa.innerHTML = `
  <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
    <path d="M16.003 3C9.374 3 4 8.374 4 15c0 2.385.698 4.61 1.898 6.49L4 29l7.73-1.86A11.94 11.94 0 0 0 16.003 27C22.632 27 28 21.628 28 15S22.632 3 16.003 3zm0 21.8c-1.97 0-3.8-.54-5.38-1.48l-.386-.23-4.59 1.104 1.127-4.472-.253-.408A9.78 9.78 0 0 1 6.2 15c0-5.408 4.395-9.8 9.803-9.8 5.41 0 9.803 4.392 9.803 9.8 0 5.41-4.393 9.8-9.803 9.8zm5.625-7.33c-.307-.154-1.82-.9-2.103-1.003-.282-.104-.487-.154-.693.154-.205.307-.794 1.003-.973 1.208-.18.205-.358.23-.665.076-.307-.154-1.298-.478-2.472-1.523-.913-.814-1.53-1.82-1.71-2.127-.18-.307-.02-.473.134-.627.138-.137.308-.358.462-.537.154-.18.205-.307.308-.512.103-.205.05-.384-.025-.538-.076-.154-.693-1.67-.95-2.287-.25-.6-.504-.52-.693-.53l-.59-.01c-.205 0-.538.077-.82.385-.282.307-1.076 1.05-1.076 2.562 0 1.512 1.102 2.973 1.256 3.178.154.205 2.17 3.313 5.263 4.645.736.318 1.31.508 1.758.65.738.234 1.41.2 1.94.122.592-.088 1.82-.744 2.078-1.462.256-.72.256-1.337.18-1.463-.076-.128-.282-.205-.59-.358z"/>
  </svg>
  <span class="wa-float__label">Chat on WhatsApp</span>
`;
document.body.appendChild(wa);

// ---------- Picture placeholders: resolve pic_N to first matching file ----------
const PIC_EXTS = ["jpg", "png", "webp", "jpeg"];
function tryLoad(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
async function resolvePic(el) {
  const name = el.dataset.name;
  if (!name) return;
  for (const ext of PIC_EXTS) {
    const src = `${name}.${ext}`;
    const found = await tryLoad(src);
    if (found) {
      el.style.backgroundImage = `url("${found}")`;
      el.classList.add("is-loaded");
      return;
    }
  }
}
document.querySelectorAll(".pic[data-name]").forEach(resolvePic);

// ---------- Hide custom cursor on touch devices ----------
if (matchMedia("(pointer: coarse)").matches) {
  cursor.style.display = "none";
  document.documentElement.classList.add("touch");
}
