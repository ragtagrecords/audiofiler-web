module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'react/function-component-definition': [0],
    'react/jsx-one-expression-per-line': [0],
    'arrow-body-style': [0],
    'react/destructuring-assignment': [0],
    'no-unused-vars': [1],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
