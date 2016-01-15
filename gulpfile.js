// .pipe(debug())

var gulp = require('gulp');
var browserSync = require('browser-sync');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
// var wiredep = require('wiredep').stream;

// modular tasks

gulp.task('sass', function() {
  return gulp.src([ './bower_components/include-media/dist/*.scss', 'app/scss/**/*.sass'])
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// gulp.task('wiredep', function() {
//   return gulp.src('app/index.html')
//     .pipe(wiredep());
// });

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  });
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('jshint', function() {
  return gulp.src(['app/js/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.sass', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// primary tasks

gulp.task('build', function(callback) {
  runSequence('clean:dist', 'jshint', 'sass', ['useref', 'images', 'fonts'],
    callback
  );
});

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  );
});
