var gulp = require('gulp'), 
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	prefix = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	gutil = require('gulp-util'),
	babel = require('gulp-babel'),
	rename = require('gulp-rename'),
	gap = require('gulp-append-prepend'),
	strip = require('gulp-strip-comments'),
	wait = require('gulp-wait');

gulp.task('sass', function () {  
	gulp.src('./scss/canvi.scss')
        .pipe(wait(700))
		.pipe(sass({includePaths: ['./scss/partials']}))
		.pipe(prefix(
			'last 1 version', '> 1%', 'ie 8', 'ie 7'
		))
		.pipe(minifycss())
		.pipe(gulp.dest('dist'));
});

gulp.task('js', function(){
	gulp.src('./js/*.js')
		.pipe(strip())
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-object-assign']
		}))
		.pipe(uglify())
		.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
		.pipe(gulp.dest('dist'));
});

gulp.task('js-webpack', function(){
	gulp.src('./js/*.js')
		.pipe(strip())
		.pipe(rename({
			suffix: '-webpack'
		}))
		.pipe(gap.appendText('export default Canvi;'))
		.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['sass', 'js', 'js-webpack'], function () {  
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('./js/*.js', ['js']);
});