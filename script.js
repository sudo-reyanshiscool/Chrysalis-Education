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
let cursorRunning = false;

window.addEventListener("mousemove", (e) => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx}px, ${my}px)`;
  if (!cursorRunning) {
    cursorRunning = true;
    requestAnimationFrame(cursorLoop);
  }
});

// ring lerps toward the dot, but stops when caught up
function cursorLoop() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  ring.style.transform = `translate(${rx}px, ${ry}px)`;
  if (Math.abs(mx - rx) > 0.3 || Math.abs(my - ry) > 0.3) {
    requestAnimationFrame(cursorLoop);
  } else {
    cursorRunning = false;
  }
}

// hover state on interactive elements
document.querySelectorAll("a, button, .service, input, textarea, label").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
});

window.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
window.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));


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

// ---------- Kinetic hero: per-character split ----------
(function splitHeroChars() {
  const title = document.querySelector(".hero__title[data-kinetic]");
  if (!title) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const words = title.querySelectorAll(".word");
  let globalIndex = 0;
  words.forEach((word) => {
    // Preserve <em> styling by splitting its innerHTML nodes individually.
    const walk = (node, out) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const frag = document.createDocumentFragment();
        for (const ch of text) {
          if (ch === " ") { frag.appendChild(document.createTextNode(" ")); continue; }
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch;
          span.style.animationDelay = (0.1 + globalIndex * 0.028) + "s";
          globalIndex++;
          frag.appendChild(span);
        }
        out.appendChild(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        node.childNodes.forEach((c) => walk(c, clone));
        out.appendChild(clone);
      }
    };
    const replacement = document.createDocumentFragment();
    word.childNodes.forEach((n) => walk(n, replacement));
    word.innerHTML = "";
    word.appendChild(replacement);
  });
})();


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

// ==========================================================
//  BOOK MODE — reads like a bound volume
// ==========================================================
(function bookMode() {
  const toRoman = (n) =>
    ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"][n - 1]
    || String(n);

  const chapters = Array.from(document.querySelectorAll(
    ".hero, .page-hero, .section:not(.pic-strip-section)"
  ));
  if (chapters.length < 2) return;

  const labelFor = (sec, i) => {
    if (sec.classList.contains("hero")) return "Frontispiece";
    if (sec.classList.contains("page-hero")) {
      const t = sec.querySelector(".page-hero__title");
      const txt = t ? t.textContent.replace(/\s+/g, " ").trim() : "";
      return txt.split(" ").slice(0, 3).join(" ").replace(/[.,]$/, "") || "Prologue";
    }
    const h = sec.querySelector(".section__title");
    if (h) {
      return h.textContent.replace(/\s+/g, " ").trim().split(" ").slice(0, 3).join(" ").replace(/[.,]$/, "");
    }
    const e = sec.querySelector(".section__eyebrow");
    if (e) return e.textContent.trim();
    return "Chapter " + toRoman(i + 1);
  };

  const entries = chapters.map((sec, i) => ({
    sec,
    num: toRoman(i + 1),
    title: labelFor(sec, i)
  }));

  // Build contents rail
  const rail = document.createElement("nav");
  rail.className = "guide-rail";
  rail.setAttribute("aria-label", "Contents");
  entries.forEach(({ sec, num, title }, i) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "guide-rail__item";
    a.innerHTML = `<span class="guide-rail__dot"></span><span class="guide-rail__label">${num}. ${title}</span>`;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      sec.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    rail.appendChild(a);
    sec.dataset.chapter = i;
    sec.classList.add("is-chapter");
  });
  document.body.appendChild(rail);

  // Running head
  const tag = document.createElement("div");
  tag.className = "chapter-tag";
  tag.innerHTML = `<span class="chapter-tag__num"></span><span class="chapter-tag__title"></span>`;
  document.body.appendChild(tag);

  // Folio (page number)
  const folio = document.createElement("div");
  folio.className = "folio";
  folio.innerHTML = `<span class="folio__num">I</span><span class="folio__total">/ ${toRoman(entries.length)}</span>`;
  document.body.appendChild(folio);

  // Chapter corner mark inside each section
  entries.forEach(({ sec, num, title }) => {
    if (sec.querySelector(".chapter-mark")) return;
    const mark = document.createElement("span");
    mark.className = "chapter-mark";
    mark.innerHTML = `<span class="chapter-mark__num">${num}.</span>${title}`;
    if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
    sec.prepend(mark);
  });

  // Ornament dividers between chapters
  entries.forEach(({ sec }, i) => {
    if (i === 0) return;
    const prev = sec.previousElementSibling;
    if (prev && prev.classList.contains("ornament-divider")) return;
    const orn = document.createElement("div");
    orn.className = "ornament-divider";
    orn.innerHTML = `<span>✦</span>`;
    sec.parentNode.insertBefore(orn, sec);
  });

  // "turn the page" hint on chapters without a CTA already at the bottom
  entries.forEach(({ sec }, i) => {
    if (i === entries.length - 1) return;
    if (sec.classList.contains("hero")) return;
    if (sec.querySelector(".next-link")) return;
    if (sec.querySelector(".continue-hint")) return;
    const hint = document.createElement("span");
    hint.className = "continue-hint";
    hint.textContent = "turn the page";
    if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
    sec.appendChild(hint);
  });

  // Drop-caps on the first prose paragraph of each chapter
  entries.forEach(({ sec }) => {
    const p = sec.querySelector(
      ".home-intro > p:first-of-type, .about__text p:first-child, .contact__lede"
    );
    if (p && p.textContent.trim().length > 40) p.classList.add("drop-cap");
  });

  // Activate chapter on scroll
  const items = rail.querySelectorAll(".guide-rail__item");
  const folioNum = folio.querySelector(".folio__num");
  const tagNum = tag.querySelector(".chapter-tag__num");
  const tagTitle = tag.querySelector(".chapter-tag__title");
  let activeIdx = -1;

  const setActive = (i) => {
    if (i === activeIdx) return;
    activeIdx = i;
    items.forEach((el, idx) => el.classList.toggle("is-active", idx === i));
    chapters.forEach((sec, idx) => sec.classList.toggle("is-current", idx === i));
    const { num, title } = entries[i];
    folioNum.textContent = num;
    tagNum.textContent = num + ".";
    tagTitle.textContent = " " + title;
    tag.classList.toggle("is-visible", i > 0);
    document.body.classList.toggle("guide-on-dark", chapters[i].classList.contains("hero"));
  };

  const io = new IntersectionObserver((entries2) => {
    // pick the entry with the largest ratio
    let best = null;
    entries2.forEach((e) => {
      if (!e.isIntersecting) return;
      if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
    });
    if (best) {
      const i = Number(best.target.dataset.chapter);
      if (!Number.isNaN(i)) setActive(i);
    }
  }, {
    threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
    rootMargin: "-15% 0px -30% 0px"
  });
  chapters.forEach((sec) => io.observe(sec));
})();
