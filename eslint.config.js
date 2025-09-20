import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';

import tsPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // node globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // JavaScript and React files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        // node globals
        process: 'readonly',
        Buffer: 'readonly',
        // browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'error',

      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      'import/no-unresolved': 'error',
      'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'es5',
          semi: true,
          printWidth: 80,
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
