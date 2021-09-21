module.exports = {
    "webpack": {
        "resolve": {
            "alias": {
                "react": "preact-compat",
                "react-dom": "preact-compat"
            }
        },
        configure: {
            optimization: {
                runtimeChunk: false,
                splitChunks: {
                    cacheGroups: {
                        default: false,
                    },
                    chunks(chunk) {
                        return false;
                    },
                },
            },
            output: {
                filename: 'static/js/[name].js'
            }
        },
    },
    plugins: [
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    webpackConfig.plugins[5].options.filename = 'static/css/[name].css';
                    return webpackConfig;
                },
            },
            options: {}
        },
    ],
}