'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var config = require('../package.json').config;
var fileinclude = require('gulp-file-include');


gulp.task('html', function () {
    gulp.src(config.src.html)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.dist.html));
});

gulp.task('html:watch', function () {
    gulp.watch(config.src.html, ['html']);
});