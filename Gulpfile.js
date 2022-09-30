const { src, dest, watch, series, parallel } = require("gulp");
const htmlmin = require("gulp-htmlmin");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const imgmin = require("gulp-imagemin");
const gulp = require("gulp");
//Task bonus
const requireHtml = require("gulp-processhtml");
const rewriteImagePath = require("gulp-rewrite-image-path");

var globs = {
  html: "project/*.html",
  css: "project/css/**/*.css",
  js: "project/js/**/*.js",
  images: "project/pics/*",
};
function htmlTask() {
  return src(globs.html)
    .pipe(requireHtml())
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}
gulp.task("defaultTask", () => {
  return src("project/index.html")
    .pipe(rewriteImagePath({ path: "assets/images" }));
});
// exports.html = htmlTask;

function cssTask() {
  return src(globs.css)
    .pipe(concat("style.min.css"))
    .pipe(cleanCSS())
    .pipe(dest("dist/assets"));
}
// exports.css = cssTask;

function jsTask() {
  return src(globs.js, { sourcemaps: true })
    .pipe(concat("script.min.js"))
    .pipe(terser())
    .pipe(dest("dist/assets"), { sourcemaps: "." });
  //Search Source Maps
}
// exports.js = jsTask;

function imageTask() {
  return src(globs.images).pipe(imgmin()).pipe(dest("dist/assets/images"));
}

// exports.img = imageTask;

var browserSync = require("browser-sync");
function serve(cb) {
  browserSync({
    server: {
      baseDir: "dist/",
    },
  });
  cb();
}
function reloadTask(test) {
  browserSync.reload();
  test();
}

function watchTask() {
  watch(globs.html, series(htmlTask, reloadTask));
  watch(globs.js, series(jsTask, reloadTask));
  watch(globs.css, series(cssTask, reloadTask));
  watch(globs.images, series(imageTask, reloadTask));
}

// exports.default = imageTask, cssTask, htmlTask;
exports.default = series(
  parallel(imageTask, cssTask, htmlTask, jsTask),
  serve,
  watchTask
);
