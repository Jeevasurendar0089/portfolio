/* Portfolio interactions: navigation, scroll state, copy action and footer year. */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const links = navLinks ? [...navLinks.querySelectorAll('a[href^="#"]')] : [];
  const sections = [...document.querySelectorAll("main section[id]")];
  const progress = document.getElementById("scrollProgress");
  const year = document.getElementById("currentYear");
  const copyEmail = document.getElementById("copyEmail");

  const closeMenu = () => {
    navLinks?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle?.addEventListener("click", () => {
    const open = !navLinks?.classList.contains("is-open");
    navLinks?.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      const target = id ? document.querySelector(id) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navLinks?.classList.contains("is-open")) return;
    if (!navLinks.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });

  const updateScrollState = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
    if (progress) progress.style.transform = `scaleX(${ratio})`;
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateScrollState();
      ticking = false;
    });
  }, { passive: true });
  updateScrollState();

  if (sections.length && links.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  copyEmail?.addEventListener("click", async () => {
    const email = copyEmail.dataset.email;
    const original = copyEmail.textContent;
    try {
      await navigator.clipboard.writeText(email);
      copyEmail.textContent = "Copied ✓";
      window.setTimeout(() => { copyEmail.textContent = original; }, 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  if (year) year.textContent = String(new Date().getFullYear());
});
