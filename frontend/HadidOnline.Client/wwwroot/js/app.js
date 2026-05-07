window.hadid = {
  get: key => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  remove: key => localStorage.removeItem(key),
  setTheme: theme => document.documentElement.dataset.theme = theme,
  scrollTop: () => window.scrollTo({ top: 0, behavior: 'smooth' })
};
