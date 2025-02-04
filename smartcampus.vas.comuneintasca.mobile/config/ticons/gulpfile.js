var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var sh = require('shelljs');
var ticons = require('ticons');

gulp.task('default', ['android-icons','android-splashes','ios-icons','ios-splashes']);

gulp.task('android-icons', function(done) {
	if (fs.existsSync('./icon.png')) {
		ticons.icons({
			input: 'icon.png',
			outputDir: '.',
			platforms : ['android'],
			classic: true, radius:5
		}, function (err, output) {
			if (err) throw err;
		});
	}
	done();
});

gulp.task('android-splashes', function(done) {
	var opts={
		input: 'splash.png',
		outputDir: '.',
		platforms : ['android'],
		classic: true, 
		nine: false
	};
	if (fs.existsSync('./splash.png')) {
		ticons.splashes(opts, function (err, output) {
			if (err) throw err;
		});
	}
	if (fs.existsSync('./splash-it.png')) {
		console.log('android IT localized images')
		opts.locale='it';
		opts.input='splash-it.png';
		ticons.splashes(opts, function (err, output) {
			if (err) throw err;
		});
	}
	if (fs.existsSync('./splash-en.png')) {
		console.log('android EN localized images')
		opts.locale='en';
		opts.input='splash-en.png';
		ticons.splashes(opts, function (err, output) {
			if (err) throw err;
		});
	}
	if (fs.existsSync('./splash-de.png')) {
		console.log('android DE localized images')
		opts.locale='de';
		opts.input='splash-de.png';
		ticons.splashes(opts, function (err, output) {
			if (err) throw err;
		});
	}
	done();
});

gulp.task('ios-icons', function(done) {
	if (fs.existsSync('./icon.png')) {
		ticons.icons({
			input: 'icon.png',
			outputDir: '.',
			platforms : ['ios'],
			classic: true
		}, function (err, output) {
			if (err) throw err;
		});
	}
	done();
});

gulp.task('ios-splashes', function(done) {
	var opts={
		input: 'splash.png',
		outputDir: '.',
		platforms : ['ios'],
		classic: true,
	};
	if (fs.existsSync('./splash.png')) {
		ticons.splashes(opts, function (err, output) {
			if (err) throw err;
		});
	}
	if (fs.existsSync('./splash-it.png')) {
		console.log('ios IT localized images')
		opts.locale='it';
		opts.input='splash-it.png';
		ticons.splashes(opts, function (err, output) {
			if (err) throw err;
		});
	}
	if (fs.existsSync('./splash-en.png')) {
		console.log('ios EN localized images')
		opts.locale='en';
		opts.input='splash-en.png';
		ticons.splashes(opts, function (err, output) {
			if (err) throw err;
		});
	}
	if (fs.existsSync('./splash-de.png')) {
		console.log('ios DE localized images')
		opts.locale='de';
		opts.input='splash-de.png';
		ticons.splashes(opts, function (err, output) {
			if (err) throw err;
		});
	}
	done();
});
