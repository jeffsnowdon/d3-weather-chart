'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync');
var log = require('fancy-log');
// set the sass compiler
sass.compiler = require('node-sass');

// directories
var srcDir = 'src';
var distDir = 'dist';
var scssDir = srcDir + '/scss';
var jsDir = srcDir + '/js';
var srcAssets = srcDir + '/assets';
var distAssets = distDir + '/assets';
var distCssDir = distDir + '/css';
var distJsDir = distDir + '/js';
// files
var scssFiles = scssDir + '/**/*.scss';
var jsFiles = jsDir + '/**/*.js';
var htmlFiles = srcDir + '/**/*.html';

var developerMode = true;

/* Stylesheets */
const compileSass = function () {
    return gulp.src(scssFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(distCssDir))
        .pipe(browserSync.stream());
}
const watchSass = function () {
    var watcher = gulp.watch(scssFiles);
    watcher.on('all', gulp.series('sass'))
}
gulp.task('sass', compileSass);
gulp.task('sass:watch', watchSass);

/* Javascript */
const compileJs = function () {
    return gulp.src(jsFiles)
        .pipe(gulpIf(!developerMode, uglify()))
        .pipe(gulp.dest(distJsDir))
        .pipe(browserSync.stream());
};
const watchJs = function () {
    var watcher = gulp.watch(jsFiles);
    watcher.on('all', gulp.series('js'));
}
gulp.task('js', compileJs);
gulp.task('js:watch', watchJs);

/* HTML */
const compileHtml = function () {
    return gulp.src(htmlFiles)
        .pipe(gulp.dest(distDir))
        .pipe(browserSync.stream());
};
const watchHtml = function () {
    var watcher = gulp.watch(htmlFiles);
    watcher.on('all', gulp.series('html'));
}
gulp.task('html', compileHtml);
gulp.task('html:watch', watchHtml);

/* Static Assets */
const compileAssets = function () {
    return gulp.src(srcAssets + '/*.*')
        .pipe(gulp.dest(distAssets))
        .pipe(browserSync.stream());
};
gulp.task('assets', compileAssets);

const compile = gulp.parallel('sass', 'js', 'html', 'assets');
gulp.task('build', compile);

/* All */
const doServe = function () {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'dist/index.html'
        },
        startPath: 'dist/index.html'
    });
}
const watchAll = gulp.parallel('sass:watch', 'js:watch', 'html:watch');
gulp.task('serve', gulp.parallel(compile, doServe, watchAll));