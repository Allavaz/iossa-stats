(function () {
  const currentTheme = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : null;
  if (currentTheme) {
    window.document.documentElement.setAttribute("data-theme", currentTheme);
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      window.document.documentElement.setAttribute("data-theme", "dark");
    } else {
      window.document.documentElement.setAttribute("data-theme", "light");
    }
  }
})();
