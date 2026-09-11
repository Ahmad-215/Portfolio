document.addEventListener("DOMContentLoaded", () => {


  const SKILL_CATEGORIES = [
    {
      title: "Languages",
      skills: [
        {
          name: "JavaScript (ES6+)",
          icon: "fa-brands fa-js"
        },
        {
          name: "Java",
          icon: "fa-solid fa-mug-hot"
        },
        {
          name: "C++",
          icon: "fa-solid fa-code"
        },
        {
          name: "Python",
          icon: "fa-brands fa-python"
        }
      ]
    },

    {
      title: "Frontend Development",
      skills: [
        {
          name: "HTML5",
          icon: "fa-brands fa-html5"
        },
        {
          name: "CSS3",
          icon: "fa-brands fa-css3-alt"
        },
        {
          name: "React.js",
          icon: "fa-brands fa-react"
        },
        {
          name: "Next.js",
          icon: "fa-solid fa-bolt"
        },
        {
          name: "Responsive Design",
          icon: "fa-solid fa-mobile-screen"
        }
      ]
    },

    {
      title: "Backend Development",
      skills: [
        {
          name: "Node.js",
          icon: "fa-brands fa-node-js"
        },
        {
          name: "Express.js",
          icon: "fa-solid fa-server"
        },
        {
          name: "REST API Design",
          icon: "fa-solid fa-diagram-project"
        }
      ]
    },

    {
      title: "Databases, Tools & Deployment",
      skills: [
        {
          name: "MongoDB",
          icon: "fa-solid fa-leaf"
        },
        {
          name: "MySQL",
          icon: "fa-solid fa-database"
        },
        {
          name: "Git & GitHub",
          icon: "fa-brands fa-git-alt"
        },
        {
          name: "Vercel",
          icon: "fa-solid fa-cloud-arrow-up"
        }
      ]
    }
  ];

  const skillsGrid = document.getElementById("skillsGrid");

  if (skillsGrid) {

    skillsGrid.innerHTML = SKILL_CATEGORIES
      .map(category => {

        const skillsHTML = category.skills
          .map(skill => `
            <span class="skill-chip">
              <i class="${skill.icon}" aria-hidden="true"></i>
              <span>${skill.name}</span>
            </span>
          `)
          .join("");

        return `
          <div class="skills-category" data-reveal>
            <p class="skills-category-title">
              ${category.title}
            </p>

            <div class="skills-grid">
              ${skillsHTML}
            </div>
          </div>
        `;
      })
      .join("");
  }


  /* =========================================================================
     2. MOBILE NAVIGATION
     ========================================================================= */

  const navToggle = document.getElementById("navToggle");
  const navLinksWrap = document.getElementById("navLinks");

  if (navToggle && navLinksWrap) {

    const closeMobileMenu = () => {
      navLinksWrap.classList.remove("open");

      navToggle.classList.remove("open");

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    };

    const toggleMobileMenu = () => {

      const isOpen =
        navLinksWrap.classList.toggle("open");

      navToggle.classList.toggle(
        "open",
        isOpen
      );

      navToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    };

    navToggle.addEventListener(
      "click",
      toggleMobileMenu
    );



    navLinksWrap
      .querySelectorAll(".nav-link")
      .forEach(link => {

        link.addEventListener(
          "click",
          closeMobileMenu
        );

      });



    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          navLinksWrap.classList.contains("open")
        ) {
          closeMobileMenu();

          navToggle.focus();
        }

      }
    );



    document.addEventListener(
      "click",
      event => {

        const clickedInsideNav =
          navLinksWrap.contains(event.target) ||
          navToggle.contains(event.target);

        if (
          !clickedInsideNav &&
          navLinksWrap.classList.contains("open")
        ) {
          closeMobileMenu();
        }

      }
    );

  }
      
  const sections =
    document.querySelectorAll("section[id]");

  const navLinks =
    document.querySelectorAll(".nav-link");

  if (
    sections.length &&
    navLinks.length &&
    "IntersectionObserver" in window
  ) {

    const scrollSpyObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            const sectionId =
              entry.target.getAttribute("id");

            navLinks.forEach(link => {

              const isActive =
                link.dataset.section === sectionId;

              link.classList.toggle(
                "active-link",
                isActive
              );

            });

          });

        },
        {
          rootMargin: "-40% 0px -50% 0px",
          threshold: 0
        }
      );

    sections.forEach(section => {
      scrollSpyObserver.observe(section);
    });

  }


 
  const revealTargets =
    document.querySelectorAll("[data-reveal]");

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {

    revealTargets.forEach(target => {
      target.classList.add("in-view");
    });

  } else {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            const delay =
              entry.target.dataset.revealDelay || 0;

            setTimeout(() => {

              entry.target.classList.add(
                "in-view"
              );

            }, Number(delay));

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -30px 0px"
        }
      );


    revealTargets.forEach(
      (target, index) => {

       

        target.dataset.revealDelay =
          Math.min(index * 55, 220);

        revealObserver.observe(target);

      }
    );

  }


  
  const backToTop =
    document.getElementById("backToTop");


  if (backToTop) {

    let ticking = false;


    const updateBackToTop =
      () => {

        const shouldShow =
          window.scrollY > 500;

        backToTop.classList.toggle(
          "visible",
          shouldShow
        );

        ticking = false;
      };


    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          window.requestAnimationFrame(
            updateBackToTop
          );

          ticking = true;
        }

      },
      {
        passive: true
      }
    );


    backToTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion
            ? "auto"
            : "smooth"
        });

      }
    );

  }


  
  const yearEl =
    document.getElementById("year");

  if (yearEl) {

    yearEl.textContent =
      new Date().getFullYear();

  }


  
  const navbar =
    document.getElementById("navbar");


  if (navbar) {

    let navTicking = false;


    const updateNavbar =
      () => {

        const isScrolled =
          window.scrollY > 20;


        navbar.classList.toggle(
          "scrolled",
          isScrolled
        );



        navbar.style.boxShadow =
          isScrolled
            ? "0 12px 35px rgba(0, 0, 0, 0.55)"
            : "none";


        navTicking = false;
      };


    window.addEventListener(
      "scroll",
      () => {

        if (!navTicking) {

          window.requestAnimationFrame(
            updateNavbar
          );

          navTicking = true;
        }

      },
      {
        passive: true
      }
    );



    updateNavbar();

  }


 
  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const targetId =
            link.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetId
            );

          if (!target) {
            return;
          }


          event.preventDefault();


          target.scrollIntoView({
            behavior:
              prefersReducedMotion
                ? "auto"
                : "smooth",

            block: "start"
          });

        }
      );

    });


 
  document
    .querySelectorAll("img")
    .forEach(image => {

      image.addEventListener(
        "error",
        () => {

          image.style.opacity = "0.25";

        }
      );

    });


  
  document.body.classList.add(
    "page-ready"
  );

});