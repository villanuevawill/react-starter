var gulp = require('gulp');
var concat = require('gulp-concat')
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var livereload = require('gulp-livereload');


function compile() {
  var bundler = watchify(browserify('./src/js/index.js', { debug: true }).transform(babel));
  console.log('-> bundling...');

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'))
      .pipe(livereload())
      .on('end', function() {console.log('-> Bundled')});
  }


  bundler.on('update', function() {
    console.log('-> bundling...');
    rebundle();
  });

  rebundle();
}

function watch() {
  return compile();

};

gulp.task('css', function() {
  console.log('-> building css')
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./build/css/'))
    .pipe(livereload())
    .on('end', function() {console.log('-> css built')})
});

gulp.task('watch', function() { return watch(); });
gulp.task('default', ['watch', 'css'], function(){
  livereload.listen()
  gulp.watch('src/sass/**/*.scss', ['css']);
});