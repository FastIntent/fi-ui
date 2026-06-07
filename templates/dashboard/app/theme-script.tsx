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
    var theme = stored;
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
