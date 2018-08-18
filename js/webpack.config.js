const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const srcDir = path.resolve(process.cwd(), 'src')

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const uglify = require('uglifyjs-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, './', dir)
}
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
  entry: getEntry(),

  output: {
    path: __dirname + '/dist/js',
    publicPath:"dist/",
    filename: '[name].js',
  },


  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      jquery: srcDir + "/js/lib/jquery.min.js",
      scss: srcDir + "/sass/",
      css: srcDir + "/css/",
      '@': resolve('src')
    }
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose?jQuery!expose?$'
      },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
            use: ExtractTextPlugin.extract({ 
              fallback: "style-loader", 
              use: [
                {
                  loader:'css-loader',
                  options:{
                    minimize: true //css压缩
                  }
                },
                {
                  loader:'sass-loader',
                  options:{
                    minimize: true //css压缩
                  }
                }]
          })
        },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[ext]',
              outputPath:'../',
              publicPath:'../',
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("../css/[name].css"),
    new uglify(),
  ] 
}

