var gulp = require('gulp');  
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var gutil = require('gulp-util');
var babel = require('gulp-babel');

gulp.task('sass', function () {  
    gulp.src('./scss/canvi.scss')
        .pipe(sass({includePaths: ['scss']}))
        .pipe(prefix(
			'last 1 version', '> 1%', 'ie 8', 'ie 7'
		))
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function(){
	gulp.src('./js/*.js')
		.pipe(babel())
		.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['sass', 'uglify'], function () {  
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('./js/*.js', ['uglify']);
});