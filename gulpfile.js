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

// Browserify configuration
const b = browserify({
  entries: [config.paths.entry],
  debug: true,
  plugin: [watchify],
  cache: {},
  packageCache: {}
})
.transform('babelify');
b.on('update', bundle);
b.on('log', gutil.log);

/* Gulp tasks */

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
  gulp.watch(config.paths.js, [() => {
    runSequence('lint');
  }, reload]);
});

// Default task
gulp.task('default', (cb) => {
  runSequence('clean', 'lint', 'html', 'css', 'js', 'fonts', 'watch', cb);
});

// Bundles JS using browserify
function bundle() {
  return b.bundle()
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.paths.baseDir))
  .pipe(browserSync.stream());
}