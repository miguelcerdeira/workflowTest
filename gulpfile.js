var gulp = require('gulp'),
    log = require('fancy-log'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat');

var coffeeSrcs = ['components/coffee/tagline.coffee'];
var jsSrcs = [
    'components/scripts/pixgrid.js',
    'components/scripts/rclick.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
var sassSrcs = ['components/sass/style.scss'];

gulp.task('logit', function(){
    log('oink')
});

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

gulp.task('compass', function(){
    gulp.src(sassSrcs)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded'
        })
        .on('error', log))
        .pipe(gulp.dest('builds/development/css'))
});

gulp.task('watch', function(){
    gulp.watch(coffeeSrcs,['coffee']);
    gulp.watch(jsSrcs,['js']);
    gulp.watch('components/sass/*.scss',['compass']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'watch']);
