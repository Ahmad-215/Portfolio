/* ==========================================================================
   Ahmad Hassan — Portfolio Script
   Sections:
     1. Skills data + render
     2. Mobile nav toggle
     3. Scrollspy (highlight active nav link)
     4. Scroll-reveal animations (IntersectionObserver)
     5. Back-to-top button
     6. Footer year
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------------------
     1. SKILLS — edit this array any time your stack changes.
        icon values are Font Awesome class names (fa-brands / fa-solid).
  --------------------------------------------------------------------- */
  const SKILLS = [
    { name: "HTML5",       icon: "fa-brands fa-html5" },
    { name: "CSS3",        icon: "fa-brands fa-css3-alt" },
    { name: "JavaScript",  icon: "fa-brands fa-js" },
    { name: "React.js",    icon: "fa-brands fa-react" },
    { name: "Node.js",     icon: "fa-brands fa-node-js" },
    { name: "Express.js",  icon: "fa-solid fa-server" },
    { name: "MongoDB",     icon: "fa-solid fa-leaf" },
    { name: "MySQL",       icon: "fa-solid fa-database" },
    { name: "Java",        icon: "fa-solid fa-mug-hot" },
    { name: "C++",         icon: "fa-solid fa-code" },
    { name: "Python",      icon: "fa-brands fa-python" },
    { name: "Git & GitHub",icon: "fa-brands fa-git-alt" },
    { name: "REST APIs",   icon: "fa-solid fa-diagram-project" },
    { name: "Responsive Design", icon: "fa-solid fa-mobile-screen" },
  ];

  const skillsGrid = document.getElementById("skillsGrid");
  if (skillsGrid) {
    skillsGrid.innerHTML = SKILLS.map(skill => `
      <span class="skill-chip" data-reveal>
        <i class="${skill.icon}"></i>${skill.name}
      </span>
    `).join("");
  }

  /* ---------------------------------------------------------------------
     2. MOBILE NAV TOGGLE
  --------------------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navLinksWrap = document.getElementById("navLinks");

  if (navToggle && navLinksWrap) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinksWrap.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu after clicking a link
    navLinksWrap.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navLinksWrap.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     3. SCROLLSPY — highlight the nav link for the section in view
  --------------------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("active-link", link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

  sections.forEach(section => scrollSpyObserver.observe(section));

  /* ---------------------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
  --------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // small stagger for elements revealing together
        setTimeout(() => entry.target.classList.add("in-view"), index * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(target => revealObserver.observe(target));

  /* ---------------------------------------------------------------------
     5. BACK-TO-TOP BUTTON
  --------------------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     6. FOOTER YEAR
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------
     NAVBAR BACKGROUND ON SCROLL (subtle depth cue)
  --------------------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? "0 8px 30px rgba(0,0,0,0.35)"
        : "none";
    });
  }

});