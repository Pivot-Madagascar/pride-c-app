const path = require('path')
const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslint],
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@', path.resolve(__dirname, 'src')],
                ],
                extensions: ['.js', '.jsx', '.json'],
            },
        },
    },
    rules: {
        'import/extensions': ['error', 'ignorePackages', {
            js: 'never',
            jsx: 'never',
        }],
        'import/order': ['error', {
            groups: [
                'builtin',
                'external',
                'internal',
                ['parent', 'sibling', 'index'],
            ],
            pathGroups: [
                {
                    pattern: '@dhis2/**',
                    group: 'external',
                    position: 'before',
                },
                {
                    pattern: '@mui/**',
                    group: 'external',
                    position: 'before',
                },
                {
                    pattern: '@/**',
                    group: 'internal',
                    position: 'after',
                },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
        }],
    },
}
