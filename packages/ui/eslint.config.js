import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Components intentionally co-export their cva variants, style fns, and
      // hooks (the shadcn convention) — allowlist those so Fast Refresh's
      // "only export components" rule doesn't flag the established pattern.
      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
          allowExportNames: [
            'badgeVariants',
            'buttonVariants',
            'buttonGroupVariants',
            'tabsListVariants',
            'toggleVariants',
            'navigationMenuTriggerStyle',
            'useCarousel',
            'useComboboxAnchor',
            'useDirection',
            'useSidebar',
          ],
        },
      ],
    },
  },
])
