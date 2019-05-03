const syntax = 'scss', // Syntax: sass or scss;
    gulpversion = '4',
    dest = "dist"; // Gulp version: 3 or 4

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    rsync = require('gulp-rsync'),
    fileinclude = require('gulp-file-include');

const imagemin = require('gulp-imagemin');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: dest
        },
        files: ['dist/**/*.*'],
        notify: false,
        // open: false,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    })
});

gulp.task('styles', function () {
    return gulp.src('app/' + syntax + '/**/*.' + syntax + '')
        .pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        //.pipe(cleancss({level: {1: {specialComments: 0}}})) // Opt., comment out when debugging
        .pipe(gulp.dest(dest + '/css'))
        .pipe(browserSync.stream())
});

gulp.task('scripts', function () {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/owl.carousel/dist/owl.carousel.min.js',
        'app/js/common.js', // Always at the end
    ])
        .pipe(concat('scripts.min.js'))
        // .pipe(uglify()) // Mifify js (opt.)
        .pipe(gulp.dest(dest + '/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest(dest + '/fonts'))
        .pipe(browserSync.reload({stream: true}))
});


gulp.task('img', function () {
    return gulp.src('app/img/**/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(dest + '/img'));
});

gulp.task('img:watch', function () {

});

gulp.task('rsync', function () {
    return gulp.src('app/**')
        .pipe(rsync({
            root: 'app/',
            hostname: 'username@yousite.com',
            destination: 'yousite/public_html/',
            // include: ['*.htaccess'], // Includes files to deploy
            exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }))
});

gulp.task('html', function () {
    return gulp.src("app/**/*.html")
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(dest));
});

// gulp.task('html:watch', function () {
//     gulp.watch(config.src.html, ['html']);
// });

if (gulpversion == 3) {
    gulp.task('watch', ['styles', 'scripts', 'browser-sync', 'html'], function () {
        gulp.watch('app/' + syntax + '/**/*.' + syntax + '', ['styles']);
        gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
        gulp.watch('app/img/**/*.*', ['img']);
        gulp.watch('app/**/*.html', ['html']);
    });
    gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
    gulp.task('watch', function () {
        gulp.watch('app/' + syntax + '/**/*.' + syntax + '', gulp.parallel('styles'));
        gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
        gulp.watch('app/img/**/*.*',  gulp.parallel('img'));
        gulp.watch('app/**/*.html', gulp.parallel('html'));

    });
    gulp.task('default', gulp.parallel('html', 'fonts', 'styles', 'scripts', 'img', 'browser-sync', 'watch'));
}
