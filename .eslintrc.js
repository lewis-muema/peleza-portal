module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:vue/recommended'],
  extends: ['plugin:vue/base'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
};
