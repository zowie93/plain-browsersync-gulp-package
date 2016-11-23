// Define gulp basepaths
var basePaths = {
    basedir: './app/',
    bower: './bower_components/'
};

// browser-sync watched files
var browserSyncWatchFiles = [
    'index.html',
    basePaths.basedir + 'assets/js/*.js',
    basePaths.basedir + 'assets/css/*.css'
];

// bower-sync options
var browserSyncOptions = {
    server: {
        baseDir: 'app'
    }
};

// require gulp packages and stock gulp requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


// Run:
// $ gulp sass
// sass task for converting scss to css in the assets/css folder
gulp.task('sass', function() {
    return gulp.src('app/assets/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('app/assets/css'))
});

// Run:
// $ gulp watch
// gulp watcher use this one if you edit scss files within the scss folder
gulp.task('watch', function (){
    gulp.watch('app/assets/scss/**/*.scss', ['sass']);
    gulp.watch('app/assets/css/style.css', ['cssnano']);
    gulp.watch('app/*.html');
    gulp.watch('app/assets/js/**/*.js');
});

// Run:
// $ gulp cssnano
// Minifies CSS files
gulp.task('cssnano', ['cleancss'], function(){
    return gulp.src('app/assets/css/*.css')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano({discardComments: {removeAll: true}}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/assets/css/'))
        .pipe(reload({stream: true}));
});

// Run:
// $ gulp cleancss
// Sub gulp task for overwriting minified css class
gulp.task('cleancss', function() {
    return gulp.src('app/assets/css/*.min.css', { read: false }) // much faster
        .pipe(ignore('style.css'))
        .pipe(rimraf());
});

// Run:
// $ gulp browser-sync
// Starts browser-sync task for starting the server.
gulp.task('browserSync', function() {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions)
});

// Run:
// $ gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task('watch-bs', ['browserSync', 'watch', 'cssnano'], function (){ });


// Run:
// $ gulp
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task('default', ['browserSync', 'watch', 'cssnano'], function (){ });

