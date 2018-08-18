var gulp = require('gulp');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var pump = require('pump');
var gulpOpen = require('gulp-open');
var borwserSync = require('browser-sync').create()
var reload = borwserSync.reload
var watch = require('gulp-watch')
var sourcemaps = require("gulp-sourcemaps")


var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var spriter = require('gulp-css-spriter'); 
var base64 = require('gulp-css-base64');
var autoprefixer = require('gulp-autoprefixer');
var less = require("gulp-less");
var sass = require("gulp-sass");
const imagemin = require('gulp-imagemin')
var htmlmin = require('gulp-htmlmin');
var modifyCssUrls = require('gulp-modify-css-urls');

const del = require('del')
var gutil = require("gulp-util");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var host = {
    path: './dist/',
    port: 8080,
};
// 压缩js
gulp.task('script', function (cb) {
  pump([
        gulp.src('./src/js/**/*.js'),
        uglify(),
        gulp.dest('./dist/js/')
    ],
    cb
  );
});
// 压缩css
gulp.task('css', function () {
  return gulp.src(['./src/css/**/*.css','./src/css/**/*.scss','./src/css/**/*.less'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',sass.logError))
    .pipe(less())
    .pipe(autoprefixer()) //自动前缀
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css/'));
});
//压缩images
gulp.task('images', () => {
  return gulp.src('./src/images/**/*.{png,jpg,gif,svg}')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./dist/images/'));
})
// 压缩html
gulp.task('html', function() {
  return gulp.src('./src/html/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/html/'));
});

gulp.task("webpack", function (callback) {
  var myConfig = Object.create(webpackConfig);
  // run webpack
  webpack(
    // configuration
    myConfig
    , function (err, stats) {
      // if(err) throw new gutil.PluginError("webpack", err);
      // gutil.log("[webpack]", stats.toString({
      //     // output options
      // }));
      callback();
    });
});
gulp.task('c', () => {
  del('./dist').then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
})
gulp.task('watch', function () {
  // 自动监听
  livereload.listen(); //要在这里调用listen()方法
  gulp.watch(['./src/css/**/*.css', './src/css/**/*.scss', './src/css/**/*.less'], ['css'])
  gulp.watch('./src/js/**/*.js', ['js'])
  gulp.watch('./src/html/**/*.html', ['html']).on('change', reload)
});

gulp.task('connect', function() {
    
   console.log('connect------------');
  connect.server({
    root: host.path,
    port: host.port,
    livereload: true
  })
});
gulp.task('open', function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            uri: 'http://localhost:8080/html/index.html'
        }))
});

// 发布
gulp.task('default', ['html', 'webpack' , 'css','images', 'script']);
//开发
gulp.task('dev', ['connect','webpack' ,'html', 'css', 'images', 'script','watch','open']);