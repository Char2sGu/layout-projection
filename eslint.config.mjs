import eslint from '@eslint/js';
import eslintTs from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import-x';
import eslintPluginImportSort from 'eslint-plugin-simple-import-sort';

export default eslintTs.config(
  { ignores: ['**/node_modules/**', '**/dist/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        sourceType: 'module', // required for eslint-plugin-import-x
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-x': eslintPluginImport,
      'import-sort': eslintPluginImportSort,
    },
    extends: [
      eslint.configs.recommended,
      ...eslintTs.configs.recommended,
      eslintConfigPrettier,
    ],
    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import-x/resolver': {
        node: true, // eslint-import-resolver-node
        typescript: true, // eslint-import-resolver-typescript
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'eqeqeq': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unreachable-loop': 'error',
      'arrow-body-style': 'error',
      'curly': ['error', 'multi', 'consistent'],
      'default-case-last': 'error',
      'grouped-accessor-pairs': 'error',
      'no-alert': 'error',
      'no-bitwise': 'error',
      'no-console': 'error',
      'no-else-return': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-label': 'error',
      'no-implied-eval': 'error',
      'no-label-var': 'error',
      'no-negated-condition': 'error',
      'no-new-wrappers': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-useless-call': 'error',
      'no-useless-escape': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'operator-assignment': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-exponentiation-operator': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-object-spread': 'error',
      'prefer-regex-literals': 'error',
      'prefer-spread': 'error',
      'require-unicode-regexp': 'error',
      'max-params': ['warn', 3],
      'max-depth': ['warn', 4],
      'max-lines': ['warn', 300],
      'max-lines-per-function': ['warn', 50],
      'complexity': ['warn', 10],

      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['strictCamelCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: ['import', 'variable'],
          format: ['strictCamelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          selector: 'parameter',
          modifiers: ['unused'],
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'classProperty',
          format: ['strictCamelCase', 'PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        {
          selector: 'objectLiteralProperty',
          modifiers: ['requiresQuotes'],
          format: null,
        },
      ],

      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': 'error',
      'import-x/no-extraneous-dependencies': 'warn',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-default-export': 'warn',
      'import-x/no-deprecated': 'warn',
      'import-x/no-cycle': 'warn',

      'import-sort/imports': 'warn',
      'import-sort/exports': 'warn',
    },
  },
  {
    files: ['**/{main,bootstrap}*.ts', '**/server.ts'],
    rules: {
      'no-console': 'off',
      'import-x/no-default-export': 'off',
    },
  },
  {
    files: ['**/*.routes.ts', '**/*.loader-factory.ts'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },
  {
    files: ['**/*.{spec,test,effects,routes}.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['**/*.{builder,schematic}.ts', '**/ng-doc.*.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'import-x/no-default-export': 'off',
    },
  },
);
