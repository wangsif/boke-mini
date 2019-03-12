var path = require('path');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html

const outputPath = path.resolve(__dirname,'otaServiceMI/build');
var plugins = [
    //将样式统一发布到style.css中
    new ExtractTextPlugin("style.[chunkhash].css", {
        allChunks: true,
        disable: false
    }),
    //React build Production
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin()
];

plugins.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
    filename: '../index.html', //生成的html存放路径，相对于 outputPath
    template: './src/template/index.html' //html模板路径
}));

plugins.push(new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest']
}));

plugins.push(new ManifestPlugin());

//不要在开发环境下使用 [chunkhash]，因为这会增加编译时间。
// 将开发和生产模式的配置分开，并在开发模式中使用 [name].js 的文件名，
// 在生产模式中使用 [name].[chunkhash].js 文件名。
module.exports = {
    entry:{
        app: './src/main.js',
        vendor: ['react', 'react-dom']
    },
    output:{
        path:outputPath,
        publicPath:'/build/',
        filename:'[name].[chunkhash].js'
    },
    module:{
        loaders:[
            {
                test:/\.jsx$/,
                exclude:/node_modules/,
                loaders:['react-hot', 'babel?presets[]=react,presets[]=es2015,presets[]=stage-0']
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'babel'
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract(
                    "style", 'css!stylus')
            },
            {
                test: /\.css$/,
                loader:  ExtractTextPlugin.extract(
                    "style", 'css')
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg)\w*/,
                loader: 'file'
            },
            {
                test:/\.json$/,
                loader:'json'
            }
        ]
    },
    babel: {
        presets: ['es2015','react','stage-0'],
        plugins: ['transform-decorators-legacy' ]
    },
    resolve:{
        root:path.resolve(__dirname,'src')
    },
    plugins:plugins
}