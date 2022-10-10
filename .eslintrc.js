module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/typescript/recommended'],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': 'off',
        'no-debugger': 'warn',
        quotes: ['warn', 'single'],
        'no-use-before-define': 'off',
        'no-undef': 'off',
        'no-shadow': 'error',
        'no-labels': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'no-restricted-syntax': 'off',
        'max-classes-per-file': 'off',
        'no-continue': 'off',
        'no-param-reassign': ['error', { props: false }],
        'guard-for-in': 'off',
        'no-underscore-dangle': 'off',
        'no-useless-constructor': 'off',
        'no-plusplus': 'off',
        'dot-notation': 'off',
        'no-lonely-if': 'off',
        'import/no-cycle': 'off',
        'no-empty': 'off',

        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    Function: false
                }
            }
        ]
    },
    overrides: [
        {
            files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
            env: {
                jest: true
            }
        }
    ]
};
