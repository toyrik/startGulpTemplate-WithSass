const gulp         = require('gulp');
const concat       = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const del          = require('del');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const gcmq = require('gulp-group-css-media-queries');

const patch = {
  
  sassFiles: {
   dev:'./dev/sass/*.*',
   watch: './dev/sass/**/*.*'
  },

	jsFiles: [
    './dev/js/*.js'
    ],

	htmlFiles: [
    './dev/*.html'
    ],

  imgFiles: [
  	'./dev/img/**/*.*'
  ]
  
};


function devSass() {
  return gulp.src(patch.sassFiles.dev)
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(sourcemaps.write())
  //.pipe(gcmq())
  .pipe(gulp.dest('./css'))
  .pipe(browserSync.stream());
}

function stylesSass() {
  return gulp.src(patch.sassFiles.dev)
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
      browsers: ['>0.1%'],
      cascade: false
    }))
  .pipe(cleanCSS({
     level: 2
    }))
  .pipe(gulp.dest('./css'));
}

function scripts() {
  return gulp.src(patch.jsFiles)
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src(patch.htmlFiles)
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
}

function img() {
  return gulp.src(patch.imgFiles)
    .pipe(gulp.dest('./img'))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
          server: {
              baseDir: "./"
          }
      });

  gulp.watch(patch.sassFiles.watch, devSass);
  gulp.watch(patch.jsFiles, scripts);
  gulp.watch(patch.imgFiles, img);
  gulp.watch(patch.htmlFiles, html).on('change', browserSync.reload);
}

function clear() {
  return del(['./css/*', './img/*', './js/*', './*.html']);
}


gulp.task('styles', devSass);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clear, gulp.parallel(stylesSass, scripts, img, html)));
gulp.task('dev', gulp.series(clear, gulp.parallel(devSass, scripts, img, html)));
gulp.task('default', gulp.series('dev', watch));
