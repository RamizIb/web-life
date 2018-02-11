"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
       autoprefixer({browsers: [
         "last 2 versions",
         "last 2 Chrome versions",
         "last 2 Firefox versions",
         "last 2 Opera versions",
         "last 2 Edge versions"
        ]})
    ]))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("less/**/*.less", ["style"]);
  gulp.watch("articles/*.html").on("change", server.reload);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("clean", function() {
  return del("docs");
});

gulp.task("copy", function() {
  return gulp.src([
    "css/**",
    "font/**/**",
    "img/**/**",
    "js/**",
    ".htaccess",
    "robots.txt",
    "articles/*.html",
    "articles/images/**",
    "*.html"
    ], {
      base: "."
    })
  .pipe(gulp.dest("docs"));
});

gulp.task("style-build", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
       autoprefixer({browsers: [
         "last 2 versions",
         "last 2 Chrome versions",
         "last 2 Firefox versions",
         "last 2 Opera versions",
         "last 2 Edge versions"
        ]})
    ]))
    .pipe(gulp.dest("docs/css"));
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style-build",
    fn
  );
});
