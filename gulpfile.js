"use strict";
const gulp = require("gulp");
const concat = require("gulp-concat");
const gzip = require("gulp-gzip");

const vendorScripts = [
	"node_modules/systemjs/dist/system-polyfills.js",
	"node_modules/angular2/bundles/angular2-polyfills.min.js",
	"node_modules/systemjs/dist/system.src.js",
	"node_modules/rxjs/bundles/Rx.min.js",
	"node_modules/angular2/bundles/angular2.dev.js",
	"node_modules/angular2/bundles/router.min.js"
];

gulp.task("vendor.js", function () {
  return gulp.src(vendorScripts)
    .pipe(concat("vendor.js"))
    .pipe(gzip())
    .pipe(gulp.dest("."));
});

gulp.task("default", ["vendor.js"], function () {
});


