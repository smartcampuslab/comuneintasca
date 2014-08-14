var gulp = require('gulp');
var gutil = require('gulp-util');
var sh = require('shelljs');
var ticons = require('ticons');

gulp.task('default', ['icons','splashes']);

gulp.task('icons', function(done) {
  ticons.icons({
    input: 'icon.png',
    outputDir: '.',
    targets: ['iphone','android'],
    classic: true, 
  }, function (err, output) {
    if (err) {
        throw err;
    }
    console.log('icons done');
  });
  done();
});

gulp.task('splashes', function(done) {
  ticons.splashes({
    input: 'splash.png',
    outputDir: '.',
    targets: ['iphone','android'],
    classic: true, 
    nine: false
  }, function (err, output) {
    if (err) {
        throw err;
    }
    console.log('splashes done');
  });
  done();
});
