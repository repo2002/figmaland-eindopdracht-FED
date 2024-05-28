const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');

function compileSCSS() {
  return src('src/scss/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(dest('public/css'));
}

function optimizeImages() {
  return src('src/images/*')
    .pipe(imagemin())
    .pipe(dest('public/images'));
}

function bundleJS() {
  return src('src/js/*.js')
    .pipe(terser())
    .pipe(dest('public/js'));
}

function watchFiles() {
  watch(['src/scss/*.scss'], compileSCSS);
  watch(['src/images/*'], optimizeImages);
  watch(['src/js/*.js'], bundleJS);
}

function browserSyncServe() {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });
}

exports.dev = series(
  parallel(compileSCSS, optimizeImages, bundleJS),
  watchFiles,
  browserSyncServe
);

exports.build = parallel(compileSCSS, optimizeImages, bundleJS);
