"use strict";
const gulp = require("gulp");
const typescript = require("gulp-typescript");
const tslint = require("gulp-tslint");
const tscConfig = require("./tsconfig.json");



gulp.task("compile", function () {
  return gulp.src(tscConfig.files)
    .pipe(tslint())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest(function(file) {
      return file.base;
    }));
});

gulp.task("default", ["compile"], function () {
});


