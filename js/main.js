document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const toggleIcon = navToggle ? navToggle.querySelector("use") : null;

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      if (toggleIcon) toggleIcon.setAttribute("href", open ? "#icon-close" : "#icon-menu");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        if (toggleIcon) toggleIcon.setAttribute("href", "#icon-menu");
      })
    );
  }

  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
  });

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    const onScroll = () => backToTop.classList.toggle("show", window.scrollY > 560);
    window.addEventListener("scroll", onScroll, { passive: true });
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const buttons = group.querySelectorAll(".tab-btn");
    const panels = group.querySelectorAll(".tab-panel");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        panels.forEach((p) => p.classList.toggle("active", p.id === btn.dataset.target));
      });
    });
  });

  const activateHash = (hash) => {
    if (!hash) return;
    const target = hash.replace("#", "");
    const btn = document.querySelector(`.tab-btn[data-target="${target}"]`);
    if (btn) {
      btn.closest("[data-tabs]").querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      btn.closest("[data-tabs]").querySelectorAll(".tab-panel").forEach((p) =>
        p.classList.toggle("active", p.id === target)
      );
    }
    const el = document.getElementById(target);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "auto", block: "start" }), 60);
  };
  window.addEventListener("hashchange", () => activateHash(location.hash));
  if (location.hash) activateHash(location.hash);

  document.querySelectorAll(".acc-item").forEach((item) => {
    const head = item.querySelector(".acc-head");
    if (!head) return;
    head.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      item.closest("[data-acc-group]").querySelectorAll(".acc-item.open").forEach((o) => {
        o.classList.remove("open");
        o.querySelector(".acc-head").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;
      const status = form.querySelector(".form-status");
      const name = form.querySelector("[name=name]").value.trim() || "your";
      if (status) {
        status.textContent = `Thank you, ${name}. Your inquiry has been received. Our team will respond within 24 hours.`;
        status.className = "form-status ok";
        status.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      if (btn) setTimeout(() => (btn.disabled = false), 2500);
    });
  }

  document.querySelectorAll(".footer-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
