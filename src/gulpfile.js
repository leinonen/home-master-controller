var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
//var minifyCSS = require('gulp-minify-css');
var path = require('path');
//var Server = require('karma').Server;
//var jasmine = require('gulp-jasmine');

gulp.task('less', function () {
  //return gulp.src('./client/public/app/**/*.less')
  return gulp.src('./client/public/app/**/*.less')
    .pipe(less({
      paths: ['./client/less']
    }))
//    .pipe(minifyCSS())
    .pipe(concat('hmc.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('./client/public'));
});
/*
gulp.task('test', function (done) {
  new Server({
    configFile: path.join(__dirname, './client/karma.conf.js'),
    singleRun: true
  }, done).start();
});

gulp.task('jasmine', function () {
  return gulp.src('./server/spec/scheduler.spec.js')
    .pipe(jasmine());
});
*/
gulp.task('default', ['less']);
