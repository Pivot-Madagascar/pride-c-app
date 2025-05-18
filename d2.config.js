const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    type: 'app',

    entryPoints: {
        app: './src/App.js',
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
                        'sass-loader',
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
