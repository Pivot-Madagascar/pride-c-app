const path = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
            },
        },
    },
    resolve : {
        alias: { 
            '@': path.resolve(__dirname, './src'),
        }
    }
});

