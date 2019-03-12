var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const outputPath = path.resolve(__dirname, 'production/build');
var plugins = [
    //将样式统一发布到style.css中
    new ExtractTextPlugin("style.css", {
        allChunks: true,
        disable: false
    }),
    new webpack.HotModuleReplacementPlugin()
];

plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor'
}));

module.exports = {
    devServer: {
        proxy: {
            '/ota/*': {
                target: 'http://localhost:8090',//ota-service地址；
                secure: false,
                cookieDomainRewrite: "",
                pathRewrite: {'^/ota': ''}
            },
            '/uc/*': {
                target: 'http://27.148.196.90:8083',//user-center地址；
                secure: false,
                cookieDomainRewrite: "",
                pathRewrite: {'^/uc': ''}
            },
            '/app/*': {
                target: 'http://27.148.196.90:8081',//线上地址；
                secure: false,
                cookieDomainRewrite: "",
                pathRewrite: {'^/app': ''}
            },
            '/service/*': {
                target: 'http://27.148.196.90:8082',//线上地址；
                secure: false,
                cookieDomainRewrite: "",
                pathRewrite: {'^/service': ''}
            }
        },
        historyApiFallback: true,
        port: '5011',
        hot: true,
        inline: true
    },
    entry: {
        app: './src/main.js',
        vendor: ['react', 'react-dom']
    },
    output: {
        path: outputPath,

        publicPath: '/assets/',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015,presets[]=stage-0']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract(
                    "style", 'css!stylus')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    "style", 'css')
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg)\w*/,
                loader: 'file'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader?strictMath&cleancss"
            }
        ]
    },
    babel: {
        presets: ['es2015', 'react', 'stage-0'],
        plugins: ['transform-decorators-legacy']
    },
    resolve: {
        root: path.resolve(__dirname, 'src')
    },
    plugins: plugins,
    devtool: 'source-map'
}