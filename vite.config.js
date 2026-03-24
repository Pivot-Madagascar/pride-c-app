const { defineConfig } = require('vite');

module.exports = defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
            },
        },
    },
});
