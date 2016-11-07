// Gulp imports
const gulp = require('gulp');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');

// Other libraries
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const browserify = require('browserify');
const del = require('del');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const styleguide = require('devbridge-styleguide');
const liveServer = require("live-server");

// Configuration
const src = 'app';
const config = {
  paths: {
    baseDir: 'dist',
    html: src + '/index.html',
    entry: src + '/index.js',
    js: src + '/**/*.js',
    css: src + '/**/*.scss',
    fonts: src + '/fonts/**/*'
  }
};

/* Gulp tasks */

gulp.task('test-styleguide', function(cb){

  runSequence('clean', 'lint', 'html', 'css', 'js', 'fonts', 'start-styleguide', cb);

});

gulp.task('start-styleguide', function () {
  styleguide.startServer({
    styleguidePath: 'styleguide'
  });

  var params = {
    port: 8080, // Set the server port. Defaults to 8080.
    root: config.paths.baseDir,
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
    wait: 100, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
  };
  liveServer.start(params);

});

// Clean 'dist' directory
gulp.task('clean', () => {
  return del(['dist/**/*']);
});

// Linting
gulp.task('lint', () => {
  return gulp.src(config.paths.js)
  .pipe(eslint())
  .pipe(eslint.format())
});

// Copy index.html to 'dist' directory
gulp.task('html', () => {
  return gulp.src(config.paths.html)
  .pipe(gulp.dest(config.paths.baseDir))
  .pipe(browserSync.stream());
});

// Bundles SASS and CSS files
gulp.task('css', () => {
  return gulp.src(
    [
      'node_modules/bootstrap/dist/css/bootstrap.css',
      config.paths.css
    ]
  )
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('bundle.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.paths.baseDir))
  .pipe(browserSync.stream());

});


// Bundles JS files
gulp.task('js', bundle);

// Copies fonts to 'dist' directory
gulp.task('fonts', () => {
  return gulp.src([config.paths.fonts, 'node_modules/font-awesome/fonts/**'])
  .pipe(gulp.dest(config.paths.baseDir + '/fonts'));
});

// Re-runs tasks when files are changed
gulp.task('watch', () => {
  browserSync.init({
    server: config.paths.baseDir
  });

  gulp.watch(config.paths.html, ['html', reload]);
  gulp.watch(config.paths.css, ['css', reload]);
  gulp.watch(config.paths.js, () => {
    runSequence('lint', 'js', reload);
  });
});

// Default task
gulp.task('default', (cb) => {
  runSequence('clean', 'lint', 'html', 'css', 'js', 'fonts', 'watch', cb);
});

// Bundles JS using browserify
function bundle() {

  const b = browserify({
    entries: [config.paths.entry],
    debug: true,
    plugin: [watchify],
    cache: {},
    packageCache: {}
  }).transform('babelify');
  b.on('update', bundle);
  b.on('log', gutil.log);

  return b.bundle()
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.paths.baseDir))
  .pipe(browserSync.stream());
}