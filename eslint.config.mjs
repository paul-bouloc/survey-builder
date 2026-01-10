import pluginQuery from '@tanstack/eslint-plugin-query'
import nextConfig from 'eslint-config-next'
import nextTypescript from 'eslint-config-next/typescript'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextConfig,
  ...nextTypescript,
  ...pluginQuery.configs['flat/recommended'],
  reactRefresh.configs.recommended,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ]),
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-object-spread': 'error',
      'prefer-destructuring': 'error',
      'linebreak-style': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  eslintPluginPrettierRecommended
])

export default eslintConfig
