var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
//存储页面路径信息

//配置页面
// {
//     folder: 'index', 文件夹
//     html: 'index',   页面
//     title: '首页',  
//     chunks: ['index']
// },
var htmlArray = [
    {
        folder: '',
        html: 'index',
        title: '首页'
    },
    {
        folder: 'cart',
        html: 'cart',
        title: '登录'
    },
];
// function getEntry() {
//     var matchs = [], files = {};
//     htmlArray.forEach(function (item) {
//         if (item.folder != '') {
//             matchs[0] = item.folder + '\\' + item.html;
//             console.log(path.join(path.resolve(srcDir, 'js'), item.folder) + '1111')
//             files[matchs[0]] = path.resolve(srcDir, 'js') + '\\' + item.folder + '\\' + item.html + '.js';
//         } else {
//             matchs[0] =item.html;
//             files[matchs[0]] = path.resolve(srcDir, 'js') + '\\' + item.html + '.js';
//         }
//     });
//     console.log(JSON.stringify(files) + '666666');
//     return files;
// }
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        } else {
            var dirss = fs.readdirSync(path.join(path.resolve(srcDir, 'js'), item))
            dirss.forEach(function (items) {
                matchs = items.match(/(.+)\.js$/);
                matchs[1] = item + '\\' + matchs[1];
                console.log(matchs[1]+'555')
                files[matchs[1]] = path.resolve(srcDir, 'js', item) + '\\' + dirss;
            });
        }
    });
    return files;
}

module.exports = {
    cache: true,
    devtool: "source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, "dist/aa"),
        publicPath: "dist/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            jquery: srcDir + "/js/lib/jquery.min.js"
        }
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'images/[name].[ext]?[hash]',
                            limit: 10000
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new CommonsChunkPlugin('common.js'),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};