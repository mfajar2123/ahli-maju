import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      'artifacts/**',
      '.install-backup/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        IntersectionObserver: 'readonly',
        requestAnimationFrame: 'readonly',
        scrollY: 'readonly',
      },
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        innerWidth: 'readonly',
        PerformanceObserver: 'readonly',
        performance: 'readonly',
        getComputedStyle: 'readonly',
      },
    },
  },
];
