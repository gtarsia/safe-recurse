module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: [2, 'never'],
    'no-param-reassign': ['off'],
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'object-curly-newline': ['error', {
      ObjectPattern: { minProperties: 5 },
    }]
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
