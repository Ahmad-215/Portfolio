/* 3D LAYER — load AFTER script.js. Vanilla JS, no libraries. */
document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const visual = document.querySelector(".hero-visual");
  let mouse = { x: 0, y: 0 };

  if (reduce || !finePointer) return; // tilt effects: mouse only

  /* ---------- 2. Hero depth follows the mouse ---------- */
  const hero = document.getElementById("home");
  if (hero && visual) {
    window.addEventListener("pointermove", e => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      visual.style.setProperty("--hry", (mouse.x * 8).toFixed(2) + "deg");
      visual.style.setProperty("--hrx", (-mouse.y * 8).toFixed(2) + "deg");
    }, { passive: true });
  }

  /* ---------- 3. Tilt + glare on cards ---------- */
  const addTilt = (el, max) => {
    el.classList.add("tilt");
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - py) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      el.classList.add("tilting");
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.classList.remove("tilting");
    });
  };

  document.querySelectorAll(".project-card").forEach(el => addTilt(el, 10));
  document.querySelectorAll(".skills-category").forEach(el => addTilt(el, 4));
});

/* ---------- PRO LAYER: progress, cursor light, cubes, timeline, parallax ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // stagger index for skill chips
  document.querySelectorAll(".skills-grid").forEach(g =>
    g.querySelectorAll(".skill-chip").forEach((c, i) => c.style.setProperty("--i", i)));

  // timeline line draws when visible
  const tl = document.querySelector(".timeline");
  if (tl) {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e], o) => {
        if (e.isIntersecting) { tl.classList.add("drawn"); o.disconnect(); }
      }, { threshold: 0.2 }).observe(tl);
    } else tl.classList.add("drawn");
  }

  // scroll progress bar
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  // cursor light
  if (fine && !reduce) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const follow = () => {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = `translate3d(${gx}px,${gy}px,0)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  // scroll: progress + parallax
  const bgs = [...document.querySelectorAll(".section-bg")];
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    if (!reduce) {
      bgs.forEach(bg => {
        const r = bg.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        const off = r.top + r.height / 2 - window.innerHeight / 2;
        bg.style.setProperty("--py", (-off * 0.08).toFixed(1) + "px");
      });
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
});
