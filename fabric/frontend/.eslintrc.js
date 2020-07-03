module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    plugins: ['react'],
    rules: {
        quotes: ['warn', 'single', { avoidEscape: true }],
        semi: ['warn', 'always'],
        'react/prop-types': ['off'],
        'jsx-quotes': ['warn', 'prefer-single']
    },
    env: {
        'browser': true,
        'es6': true
    }
};
