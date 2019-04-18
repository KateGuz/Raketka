'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var config = require('../package.json').config;
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var include = require('gulp-include');
var uglify = require('gulp-uglify');


gulp.task('js', function () {
    gulp.src(config.src.js)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel())
        .pipe(include({
            extensions: "js",
            hardFail: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.dist.js));
});

gulp.task('js:watch', function () {
    gulp.watch([config.src.js, 'src/js/components/**/*.js'], ['js']);
});