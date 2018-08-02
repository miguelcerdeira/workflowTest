var gulp = require('gulp'),
    log = require('fancy-log'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat');

var coffeeSrcs = ['components/coffee/tagline.coffee'];
var jsSrcs = [
    'components/scripts/pixgrid.js',
    'components/scripts/rclick.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

gulp.task('coffee', function(){
    gulp.src(coffeeSrcs)
        .pipe(coffee({ bare: true })
            .on('error', log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
    gulp.src(jsSrcs)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
});