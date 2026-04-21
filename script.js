// Cabinet MUCZINSKI — interactions

document.addEventListener("DOMContentLoaded", () => {

  // Current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header: fade out while scrolling hero, darken when back
  const header = document.getElementById("header");
  const hero = document.getElementById("home-banner");
  const onScroll = () => {
    if (!header) return;
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    const scroll = window.scrollY;
    const opacity = Math.max(0, 1 - scroll / (heroHeight * 0.6));
    header.style.opacity = opacity;
    header.style.pointerEvents = opacity <= 0 ? "none" : "auto";
    header.classList.toggle("scrolled", scroll > 50);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scroll reveal via IntersectionObserver
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (reduced) {
    revealEls.forEach(el => el.classList.add("visible"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }

  // Language toggle (visual only)
  document.querySelectorAll(".lang-switch span").forEach(sp => {
    sp.addEventListener("click", () => {
      document.querySelectorAll(".lang-switch span").forEach(s => s.classList.remove("active"));
      sp.classList.add("active");
    });
  });

  // Smooth anchor scroll offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) { e.preventDefault(); return; }
      const target = document.querySelector(id);
      if (!target) { e.preventDefault(); return; }
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    });
  });

  // Mobile menu toggle — iOS-safe scroll lock
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".main-nav");
  let savedScrollY = 0;

  const lockScroll = () => {
    savedScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    window.scrollTo(0, savedScrollY);
  };

  const closeMenu = () => {
    if (!nav.classList.contains("open")) return;
    nav.classList.remove("open");
    toggle.classList.remove("open");
    unlockScroll();
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      isOpen ? lockScroll() : unlockScroll();
    });

    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", closeMenu);
    });

    // Close when tapping outside nav/toggle
    document.addEventListener("touchstart", (e) => {
      if (nav.classList.contains("open") &&
          !nav.contains(e.target) &&
          !toggle.contains(e.target)) {
        closeMenu();
      }
    }, { passive: true });
  }

  // Practice cards — tap to reveal description on touch screens
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    document.querySelectorAll(".practice-item").forEach(item => {
      item.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        // Close all cards first
        document.querySelectorAll(".practice-item").forEach(c => c.classList.remove("active"));
        // Toggle clicked card
        if (!isActive) item.classList.add("active");
      });
    });
  }
});
