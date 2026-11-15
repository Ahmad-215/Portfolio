/* 3D LAYER — load AFTER script.js. Vanilla JS, no libraries. */
document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1. Rotating 3D globe behind hero photo ---------- */
  const visual = document.querySelector(".hero-visual");
  let mouse = { x: 0, y: 0 };

  if (visual) {
    const canvas = document.createElement("canvas");
    canvas.className = "globe3d";
    canvas.setAttribute("aria-hidden", "true");
    visual.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let W = 0, H = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Fibonacci sphere points + static neighbour pairs
    const N = 110, pts = [], pairs = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (2 * (i + 0.5)) / N;
      const r = Math.sqrt(1 - y * y);
      const t = i * 2.399963;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], dz = pts[i][2] - pts[j][2];
        if (dx * dx + dy * dy + dz * dz < 0.23) pairs.push([i, j]);
      }
    }

    let rotY = 0, rotX = 0.35, sx = 0, sy = 0, running = true;
    const proj = new Array(N);

    const draw = () => {
      sx += (mouse.x - sx) * 0.05;
      sy += (mouse.y - sy) * 0.05;
      const a = rotY + sx * 0.6, b = rotX + sy * 0.35;
      const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      const R = Math.min(W, H) * 0.46, cx = W / 2, cy = H / 2, d = 3.2;

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < N; i++) {
        const [x, y, z] = pts[i];
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        const s = d / (d - z2);
        proj[i] = [cx + x1 * s * R, cy + y2 * s * R, z2, s];
      }

      ctx.lineWidth = 1;
      for (const [i, j] of pairs) {
        const p = proj[i], q = proj[j];
        const depth = (p[2] + q[2]) / 2;
        ctx.strokeStyle = `rgba(34,211,238,${(0.05 + 0.3 * (depth + 1) / 2).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }

      for (let i = 0; i < N; i++) {
        const p = proj[i];
        const al = 0.2 + 0.8 * (p[2] + 1) / 2;
        ctx.fillStyle = i % 3 === 0 ? `rgba(129,140,248,${al})` : `rgba(34,211,238,${al})`;
        ctx.beginPath(); ctx.arc(p[0], p[1], 1.2 + 1.8 * p[3] * (p[2] + 1) / 2, 0, 6.2832); ctx.fill();
      }
    };

    const loop = () => {
      if (!running) return;
      rotY += 0.003;
      draw();
      requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", () => { resize(); if (reduce) draw(); });

    if (reduce) {
      draw();
    } else {
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([e]) => {
          const was = running;
          running = e.isIntersecting;
          if (running && !was) requestAnimationFrame(loop);
        }).observe(visual);
      }
      requestAnimationFrame(loop);
    }
  }

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

  // floating 3D cubes in hero
  const hero = document.getElementById("home");
  if (hero) {
    const wrap = document.createElement("div");
    wrap.className = "hero-shapes";
    wrap.setAttribute("aria-hidden", "true");
    [["6%", "22%", 54, "22s"], ["88%", "16%", 38, "28s"], ["46%", "86%", 30, "18s"]].forEach(([l, t, s, d], k) => {
      wrap.insertAdjacentHTML("beforeend",
        `<div class="cube-wrap" data-depth="${k + 1}" style="left:${l};top:${t}"><div class="cube" style="--s:${s}px;--d:${d}"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`);
    });
    hero.prepend(wrap);
  }

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
  const cubes = [...document.querySelectorAll(".cube-wrap")];
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
      cubes.forEach(c => { c.style.translate = `0 ${(-y * 0.07 * c.dataset.depth).toFixed(1)}px`; });
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
});
