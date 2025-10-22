/**
 * Theme initialization script
 * This script runs before the page renders to prevent flash of unstyled content (FOUC)
 */
(function () {
  try {
    // Parse cookies
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    let theme = null;

    // Find theme cookie
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=');
      const name = decodeURIComponent(parts[0]);
      if (name === 'theme') {
        theme = decodeURIComponent(parts.slice(1).join('='));
        break;
      }
    }

    const root = document.documentElement;

    // Apply theme from cookie
    if (theme === 'dark' || theme === 'light') {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      // Fallback to system preference
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  } catch (e) {
    // Ignore any script errors to avoid blocking initial render
    console.error('Theme initialization error:', e);
  }
})();
