module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    'ts-prune --error'
  ]
};