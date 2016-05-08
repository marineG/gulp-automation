var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] }); 
var less = require('gulp-less');
var path = require('path');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber'); 
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var fs = require('node-fs'); 
var fse = require('fs-extra'); 
var json = require('json-file');
var themeName = json.read('./package.json').get('themeName');
var themeDir = '../' + themeName;

gulp.task('default', ['less', 'js', 'img', 'watch']);


//style
gulp.task('less', function () {
  return gulp.src('css/less/**/*.less')
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ],
      plugins: [autoprefix]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
   	.pipe(livereload());
});

//scripts + uglify
gulp.task('js', function () {
 
 return gulp.src('js/src/**/*.js')

	.pipe(sourcemaps.init()) 
	.pipe(jshint()) 
	.pipe(jshint.reporter('fail')) 
	.pipe(concat('theme.js'))
	.pipe(sourcemaps.write())
	.pipe(uglify())
	.pipe(gulp.dest('js')) 	
   	.pipe(livereload());
});

// images optimisation
gulp.task('img', function() {
 
  gulp.src('img/src/*.{png,jpg,gif}')
 
    .pipe(imagemin({
 
      optimizationLevel: 7,
 
      progressive: true
 
    }))
 
    .pipe(gulp.dest('img'))
   	.pipe(livereload());
 
});

//watch task
gulp.task('watch', function() {
  
  livereload.listen();

  gulp.watch('css/less/**/*.less', ['less']);
 
  gulp.watch('js/src/**/*.js', ['js']);
 
  gulp.watch('img/src/*.{png,jpg,gif}', ['img']);
 
});

//Error handling
var plumberErrorHandler = { errorHandler: notify.onError({
 
    title: 'Gulp',
 
    message: 'Error: <%= error.message %>'
 
  })
 
};

//theme-boilerplate
gulp.task('init', function() {
 
  fs.mkdir(themeDir, 765, true);
 
  fse.copy('theme-boilerplate/', themeDir + '/');
 
});