/* Theme toggle. Initial theme is applied by an inline script in <head> to avoid a flash. */
(() => {
  const STORAGE_KEY = "jeeva-portfolio-theme";
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const meta = document.querySelector('meta[name="theme-color"]');
  const systemLight = window.matchMedia("(prefers-color-scheme: light)");

  const current = () => root.getAttribute("data-theme") || (systemLight.matches ? "light" : "dark");

  function sync() {
    const light = current() === "light";
    toggle?.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    meta?.setAttribute("content", light ? "#f7f8fb" : "#0b0d12");
  }

  toggle?.addEventListener("click", () => {
    const next = current() === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* storage unavailable */ }
    sync();
  });

  systemLight.addEventListener?.("change", sync);
  sync();
})();
