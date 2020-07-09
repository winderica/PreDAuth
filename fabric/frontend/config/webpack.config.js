const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const webpackDevClientEntry = require.resolve('react-dev-utils/webpackHotDevClient');
const TerserPlugin = require('terser-webpack-plugin');

const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');

const appPackageJson = require(paths.appPackageJson);

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');

    const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

    return {
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        bail: isEnvProduction,
        devtool: isEnvProduction
            ? shouldUseSourceMap ? 'source-map' : false
            : isEnvDevelopment && 'cheap-module-source-map',
        entry: [
            isEnvDevelopment && webpackDevClientEntry,
            paths.appIndexJs,
        ].filter(Boolean),
        output: {
            path: isEnvProduction ? paths.appBuild : undefined,
            pathinfo: isEnvDevelopment,
            filename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].js'
                : isEnvDevelopment && 'static/js/bundle.js',
            futureEmitAssets: true,
            chunkFilename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].chunk.js'
                : isEnvDevelopment && 'static/js/[name].chunk.js',
            publicPath: paths.publicUrlOrPath,
            devtoolModuleFilenameTemplate: isEnvProduction
                ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
                : isEnvDevelopment &&
                (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
            jsonpFunction: `webpackJsonp${appPackageJson.name}`,
            globalObject: 'this',
        },
        optimization: {
            minimize: isEnvProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        keep_classnames: isEnvProductionProfile,
                        keep_fnames: isEnvProductionProfile,
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    sourceMap: shouldUseSourceMap,
                }),
            ],
            splitChunks: {
                chunks: 'all',
                name: false,
            },
            runtimeChunk: {
                name: entrypoint => `runtime-${entrypoint.name}`,
            },
        },
        resolve: {
            modules: ['node_modules', paths.appNodeModules].concat(
                modules.additionalModulePaths || []
            ),
            extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
            alias: {
                ...(isEnvProductionProfile && {
                    'react-dom$': 'react-dom/profiling',
                    'scheduler/tracing': 'scheduler/tracing-profiling',
                }),
                ...(modules.webpackAliases || {}),
            },
            plugins: [
                new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
            ],
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    parser: {
                        requireEnsure: false
                    }
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: imageInlineSizeLimit,
                                name: 'static/media/[name].[hash:8].[ext]',
                            },
                        },
                        {
                            test: /\.wasm$/,
                            type: 'javascript/auto',
                            loader: require.resolve('file-loader'),
                            options: {
                                name: 'static/wasm/[name].[contenthash:8].wasm',
                            }
                        },
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            include: paths.appSrc,
                            loader: require.resolve('babel-loader'),
                            options: {
                                customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                                babelrc: false,
                                configFile: false,
                                presets: [require.resolve('babel-preset-react-app')],
                                cacheIdentifier: getCacheIdentifier(
                                    isEnvProduction ? 'production' : isEnvDevelopment && 'development',
                                    [
                                        'babel-preset-react-app',
                                        'react-dev-utils',
                                        'react-scripts',
                                    ]
                                ),
                                plugins: [
                                    isEnvDevelopment && require.resolve('react-refresh/babel'),
                                ].filter(Boolean),
                                cacheDirectory: true,
                                cacheCompression: false,
                                compact: isEnvProduction,
                            },
                        },
                        {
                            test: /\.(js|mjs)$/,
                            exclude: /@babel(?:\/|\\{1,2})runtime/,
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                configFile: false,
                                compact: false,
                                presets: [
                                    [
                                        require.resolve('babel-preset-react-app/dependencies'),
                                        { helpers: true },
                                    ],
                                ],
                                cacheDirectory: true,
                                cacheCompression: false,
                                cacheIdentifier: getCacheIdentifier(
                                    isEnvProduction
                                        ? 'production'
                                        : isEnvDevelopment && 'development',
                                    [
                                        'babel-plugin-named-asset-import',
                                        'babel-preset-react-app',
                                        'react-dev-utils',
                                        'react-scripts',
                                    ]
                                ),
                                sourceMaps: shouldUseSourceMap,
                                inputSourceMap: shouldUseSourceMap,
                            },
                        },
                        {
                            loader: require.resolve('file-loader'),
                            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            options: {
                                name: 'static/media/[name].[hash:8].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin(
                {
                    inject: true,
                    template: paths.appHtml,
                    ...(isEnvProduction ? {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    } : {})
                }
            ),
            isEnvProduction &&
            shouldInlineRuntimeChunk &&
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
            new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
            new ModuleNotFoundPlugin(paths.appPath),
            new webpack.DefinePlugin(env.stringified),
            isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
            isEnvDevelopment && new ReactRefreshWebpackPlugin({
                overlay: {
                    entry: webpackDevClientEntry,
                },
            }),
            isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ].filter(Boolean),
        node: {
            module: 'empty',
            dgram: 'empty',
            dns: 'mock',
            fs: 'empty',
            http2: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
        performance: false,
    };
};
