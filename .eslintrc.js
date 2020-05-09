module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-hooks',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'indent': [ 'warn', 2 ],
    'array-bracket-spacing': [ 'warn', 'always', {
      objectsInArrays: false,
      arraysInArrays: false,
    } ],
    'eol-last': [ 'warn', 'always' ],
    'comma-dangle': [ 'warn', 'always-multiline' ],
    'quotes': [ 'warn', 'single', {
      avoidEscape: false,
      allowTemplateLiterals: true,
    } ],
    'jsx-quotes': [ 'warn', 'prefer-single' ],

    'react/jsx-tag-spacing': [ 'warn', {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'never',
    } ],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': [ 'error', {
      functions: false,
      classes: false,
    }, ],
    '@typescript-eslint/no-inferrable-types': [ 'error', {
      ignoreParameters: true,
      ignoreProperties: true,
    }, ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
