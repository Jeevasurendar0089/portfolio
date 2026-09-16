/* Theme preference with a tiny, dependency-free implementation. */
(() => {
  const STORAGE_KEY = "jeeva-portfolio-theme";
  const body = document.body;
  const toggle = document.getElementById("themeToggle");

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* Storage can be unavailable in restricted contexts. */ }
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = saved === "light" || saved === "dark" ? saved : (systemPrefersLight ? "light" : "dark");

  function applyTheme(theme) {
    const light = theme === "light";
    body.classList.toggle("light-theme", light);
    document.documentElement.style.colorScheme = light ? "light" : "dark";
    if (toggle) {
      toggle.textContent = light ? "🌙" : "☀️";
      toggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
      toggle.setAttribute("aria-pressed", String(light));
    }
  }

  applyTheme(initial);

  toggle?.addEventListener("click", () => {
    const next = body.classList.contains("light-theme") ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Continue without persistence if storage is unavailable. */ }
  });
})();
