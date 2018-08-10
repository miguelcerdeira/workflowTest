var gulp = require('gulp'),
    log = require('fancy-log'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    htmlmin = require('gulp-htmlmin'),
    jsonminify = require('gulp-jsonminify'),
    uglify = require('gulp-uglify');

var env,
    coffeeSrcs,
    jsSrcs,
    sassSrcs,
    htmlSrcs,
    jsonSrcs,
    outputDir,
    sassStyle;
    
env = process.env.NODE_ENV || 'development';

if(env==='development'){
    outputDir = 'builds/development/';
    //sassStyle = 'expanded';
    sassConfigStyle = 'expanded';
}else{
    outputDir = 'builds/production/';
    //sassStyle = 'compressed';
    sassConfigStyle = 'compressed';
}

coffeeSrcs = ['components/coffee/tagline.coffee'];
jsSrcs = [
    'components/scripts/pixgrid.js',
    'components/scripts/rclick.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
sassSrcs = ['components/sass/style.scss'];
htmlSrcs = [outputDir + '*.html'];
jsonSrcs = [outputDir + 'js/*.json'];

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
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function(){
    gulp.src(sassSrcs)
        .pipe(compass({
            config_file: 'components/sass/'+ sassConfigStyle +'-config.rb',
            css: outputDir + 'css',
            sass: 'components/sass',
            image: outputDir + 'images'
            //style: sassStyle
        })
        .on('error', log))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(coffeeSrcs,['coffee']);
    gulp.watch(jsSrcs,['js']);
    gulp.watch('components/sass/*.scss',['compass']);
    gulp.watch('builds/development/*.html', ['html'])
    gulp.watch('builds/development/js/*.json', ['json'])
});

gulp.task('connect', function(){
    connect.server({
       root: outputDir,
       livereload: true
    }); 
});

gulp.task('html', function(){
    gulp.src('builds/development/*.html')
        .pipe(gulpif(env === 'production', htmlmin({collapseWhitespace: true})))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('json', function(){
    gulp.src('builds/development/js/*.json')
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
        .pipe(connect.reload())
});

gulp.task('default', ['json', 'html','coffee', 'js', 'compass', 'connect', 'watch']);
