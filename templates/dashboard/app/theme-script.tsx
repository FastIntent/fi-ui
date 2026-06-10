/**
 * Inline script that runs *before* React hydrates, setting [data-theme]
 * from localStorage or prefers-color-scheme. Prevents flash of wrong
 * theme on first paint.
 */
const themeScript = `
(function() {
  try {
    var key = 'atomize-theme';
    var stored = localStorage.getItem(key);
    // Light is the AtomizeUI signature theme — dark is opt-in via the toggle.
    var theme = (stored === 'dark') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    // Kit theme (combinación aside/header/UI) — ver app/themes/*.css
    var kit = localStorage.getItem('atomize-kit-theme');
    if (kit && /^[a-z-]+$/.test(kit)) {
      document.documentElement.setAttribute('data-kit-theme', kit);
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
