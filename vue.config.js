const webpack = require('webpack')
const path = require('path')
const LodashWebpackPlugin = require('lodash-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

const NODE_ENV = process.env.NODE_ENV
const PUBLIC_PATH = process.env.VUE_APP_PUBLIC_PATH
const VUE_APP_OUTPUT_DIR = process.env.VUE_APP_OUTPUT_DIR
const VUE_APP_HOST = process.env.VUE_APP_HOST
const VUE_APP_API_URL = process.env.VUE_APP_API_URL


module.exports = {
    outputDir: VUE_APP_OUTPUT_DIR,
    publicPath: PUBLIC_PATH,
    assetsDir: 'static',
    lintOnSave: false,
    devServer: {
        historyApiFallback: true,
        https: false,
        host: 'localhost.jdl.com',
        // 云仓开发测试
        // host: "localhost.jclps.com",
        hot: true,
        open: true,
        port: 1024,
        disableHostCheck: true,
        proxy: {
            // '/api': {
            //     target: VUE_APP_API_URL,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': 'http://tsusf-outer.jd.com/'
            //     }
            // }
            '/api/mock': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/mock': ''
                }
            },
            //开发测试环境
            '/api': {
                target: VUE_APP_API_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    },
    transpileDependencies: [resolve('/node_modules/element-ui/src')],
    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/styles/theme/index.scss";
                    @import "@/styles/mixins.scss";
                `
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
    },
    configureWebpack: config => {
        const plugins = [
            new LodashWebpackPlugin({
                shorthands: true,
                cloning: true,
                paths: true
            }),
            new webpack.ProvidePlugin({
                CNST: '@/constants',
                _: '@/utils/lodash',
                jt: '@/utils/jt',
                req: '@/utils/req',
                api: '@/services',
                tools: '@/utils/tools',
                _params: '@/utils/params',
                auth: '@/utils/auth'
            })
        ]
        if (NODE_ENV === 'production') {
            // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
            // plugins.push(new BundleAnalyzerPlugin())

            // 开启gzip压缩
            const CompressionWebpackPlugin = require('compression-webpack-plugin')
            const productionGzipExtensions = ['js', 'css']
            plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }))
        }
        return {
            plugins
        }
    }
}
