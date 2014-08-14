var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var sh = require('shelljs');
var ticons = require('ticons');

gulp.task('default', ['android-icons','android-splashes','iphone-icons','iphone-splashes']);

gulp.task('android-icons', function(done) {
  ticons.icons({
    input: 'icon_rounded.png',
    outputDir: '.',
    platforms : ['android'],
    classic: true, radius:10
  }, function (err, output) {
    if (err) {
        throw err;
    } else {
      done();
    }
  });
});

gulp.task('android-splashes', function(done) {
  var opts={
    input: 'splash.png',
    outputDir: '.',
    platforms : ['android'],
    classic: true, 
    nine: false
  };
  ticons.splashes(opts, function (err, output) {
    if (err) {
        throw err;
    } else {
      if (fs.existsSync('./splash-en.png')) {
        console.log('generating ENGLISH localized images')
        opts.locale='en';
        ticons.splashes(opts, function (err, output) {
          if (err) {
              throw err;
          }
        });
      }
      if (fs.existsSync('./splash-de.png')) {
        console.log('generating DEUTSCHE localized images')
        opts.locale='de';
        ticons.splashes(opts, function (err, output) {
          if (err) {
              throw err;
          }
        });
      }
    }
    done();
  });
});

gulp.task('iphone-icons', function(done) {
  ticons.icons({
    input: 'icon.png',
    outputDir: '.',
    platforms : ['iphone'],
    classic: true
  }, function (err, output) {
    if (err) {
        throw err;
    } else {
      done();
    }
  });
});

gulp.task('iphone-splashes', function(done) {
  ticons.splashes({
    input: 'splash.png',
    outputDir: '.',
    platforms : ['iphone'],
    classic: true, 
  }, function (err, output) {
    if (err) {
        throw err;
    } else {
      done();
    }
  });
});
