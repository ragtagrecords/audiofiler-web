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
    'linebreak-style': [0],
    'react/function-component-definition': [0],
    'react/jsx-one-expression-per-line': [0],
    'react/jsx-no-bind': [0],
    'arrow-body-style': [0],
    'no-console': [0],
    'react/destructuring-assignment': [0],
    'no-unused-vars': [1],
    'jsx-a11y/media-has-caption': [0],
    'jsx-a11y/no-static-element-interactions': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'no-shadow': [0],
    'jsx-a11y/label-has-associated-control': [0],
    'no-param-reassign': [0],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
