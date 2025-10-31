import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginAstro from 'eslint-plugin-astro';
import pluginPrettier from 'eslint-plugin-prettier';
import astroParser from 'astro-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default defineConfig([
  // Base JavaScript configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: Object.fromEntries(
        Object.entries(globals.browser).map(([key, value]) => [
          key.trim(),
          value,
        ])
      ),
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },

  // TypeScript-specific configuration
  tseslint.configs.recommended,

  // Astro-specific configuration
  {
    files: ['**/*.astro'],
    plugins: { astro: pluginAstro },
    languageOptions: {
      parser: astroParser,
      globals: { ...globals.astro },
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: { ...pluginAstro.configs.recommended.rules },
  },

  // React-specific configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { react: pluginReact, 'react-hooks': pluginReactHooks },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReact.configs.flat['jsx-runtime'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Add React Hooks rules
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    },
    settings: { react: { version: 'detect' } },
  },

  // Prettier integration
  {
    files: ['**/*.{js,jsx,ts,tsx,astro}'],
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': 'error', // Enforce Prettier formatting
    },
  },

  // Ignore common directories
  { ignores: ['node_modules', 'dist', '.astro'] },
]);
