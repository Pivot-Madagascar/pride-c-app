const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    type: 'app',

    entryPoints: {
        app: './src/App.jsx',
    },

    viteConfigExtensions: './vite.config.js',

    // pwa: {
    //     enabled: true,
    // },

    webpack: {
        resolve: {
            alias: {
                '@': require('path').resolve(__dirname, 'src'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
                                },
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css',
            }),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
    },
}

module.exports = config;
