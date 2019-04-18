'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var config = require('../package.json').config;

gulp.task('fonts', function () {
    gulp.src(config.src.fonts)
        .pipe(gulp.dest(config.dist.fonts));
});

gulp.task('fonts:watch', function () {
    gulp.watch(config.src.fonts, ['fonts']);
});