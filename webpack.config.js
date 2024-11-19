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
        return config
    },
}
