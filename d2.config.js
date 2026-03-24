const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    type: 'app',

    entryPoints: {
        app: './src/App.jsx',
    },

    // pwa: {
    //     enabled: true,
    // },

    webpack: {
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
