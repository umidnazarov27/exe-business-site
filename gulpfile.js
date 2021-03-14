'use strict';

/* Variables */
const { src, dest } = require('gulp');
const gulp = require('gulp');

const browserSync = require('browser-sync').create();
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cssBeautify = require('gulp-cssbeautify');
const cssNano = require('gulp-cssnano');
const imageMin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass');
const stripCssComments = require('gulp-strip-css-comments');
const uglify = require('gulp-uglify');
const panini = require('panini');

/* Paths */
let path = {
  build: {
    html: 'dist/',
    js: 'dist/assets/js',
    css: 'dist/assets/css',
    img: 'dist/assets/img'
  },
  src: {
    html: 'src/*.html',
    js: 'src/assets/js/*.js',
    css: 'src/assets/sass/style.scss',
    img: 'src/assets/img/*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/assets/js/**/*.js',
    css: 'src/assets/sass/**/*.scss',
    img: 'src/assets/img/**/*.{jpg, png, svg, gif, ico}'
  },
  clean: './dist'
};

/* Tasks */
function BrowserSync(done) {
  browserSync.init({
    server: {
      baseDir: './dist/',
      port: 3000
    }
  });
}

function BrowserSyncReload(done) {
  browserSync.reload();
}


function html() {
  panini.refresh();
  return src(path.src.html, { base: 'src/' })
    .pipe(plumber())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

function css() {
  return src(path.src.css, { base: 'src/assets/sass/' })
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      Browserslist: ['last 8 version'],
      cascade: true
    }))
    .pipe(cssBeautify({
      indent: '  '
    }))
    .pipe(dest(path.build.css))
    .pipe(cssNano({
      zIndex: false,
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(stripCssComments())
    .pipe(rename({
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(dest(path.build.css));
}

function js() {
  return src(path.src.js, { base: './src/assets/js/' })
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(imageMin())
    .pipe(dest(path.build.img));
}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images));
const watch = gulp.parallel(build, watchFiles, BrowserSync);


/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;