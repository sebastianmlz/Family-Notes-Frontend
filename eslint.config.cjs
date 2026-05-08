const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'out-tsc/**',
      'public/**',
      '*.js',
      '*.d.ts',
      '**/*.spec.ts',
      '.vscode/**',
      '.history/**',
      'pnpm-lock.yaml',
      '*.log'
    ]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // point to the app tsconfig so type-aware rules include files under src/
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularPlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...angularPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        { "type": 'attribute', "prefix": 'app', "style": 'camelCase' }
      ],
      '@angular-eslint/component-selector': [
        'error',
        { "type": 'element', "prefix": 'app', "style": 'kebab-case' }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...angularTemplatePlugin.configs.recommended.rules,
      'prettier/prettier': 'error'
    }
  }
];
