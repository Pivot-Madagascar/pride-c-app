module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.splitChunks.cacheGroups = {
                ...config.optimization.splitChunks.cacheGroups,
                default: {
                    ...config.optimization.splitChunks.cacheGroups.default,
                    maxSize: 6 * 1024 * 1024, // 6 MB
                },
            }
        }
        // Silence Sass deprecation warnings
        if (config.module && config.module.rules) {
            const sassRule = config.module.rules.find(
                rule => rule.test && rule.test.toString().includes('scss')
            );
            if (sassRule && sassRule.use) {
                const sassLoader = sassRule.use.find(
                    loader => loader.loader && loader.loader.includes('sass-loader')
                );
                if (sassLoader) {
                    sassLoader.options = {
                        ...sassLoader.options,
                        sassOptions: {
                            quietDeps: true,
                            silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin'],
                        },
                    };
                }
            }
        }
        return config
    },
}
