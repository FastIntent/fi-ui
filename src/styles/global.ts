// This file exists solely to create a JS entry that imports the global SCSS.
// tsup + injectStyle will compile this to a self-contained global.js that
// injects the CSS (tokens, base reset, theme) at runtime via style-inject.
// Each per-component index.js imports this file so the styles are automatically
// available whenever any component is used.
import './global.scss';
