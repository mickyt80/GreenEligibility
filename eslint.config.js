import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'public']),

  // The app, which runs in the browser.
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // Unit tests, which run in Node with a simulated browser.
  {
    files: ['test/**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // End-to-end tests, which run in Node and drive a real browser. Code passed to
  // page.evaluate() runs inside the browser, so browser globals are allowed too.
  {
    files: ['e2e/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },

  // Config files, which run in Node.
  {
    files: ['*.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
]);
