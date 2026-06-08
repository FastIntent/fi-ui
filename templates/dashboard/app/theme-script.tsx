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
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
