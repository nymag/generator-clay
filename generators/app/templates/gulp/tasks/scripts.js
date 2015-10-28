'use strict';
var gulp = require('gulp'),
  ignore = require('gulp-ignore'),
  concat = require('gulp-concat'),
  hasFolderChanged = require('gulp-folder-changed'),
  groupConcat = require('gulp-group-concat'),
  map = require('vinyl-map'),
  browserify = require('browserify'),
  path = require('path'),
  files = require('@nymdev/amphora/lib/files'),
  componentUtil = require('../util/components'),
  globalScripts = [
    'node_modules/eventify/dist/eventify.min.js',
    'node_modules/dollar-slice/index.js',
    'global/js/lib/**',
    'global/js/values.js',
    'global/js/*.js'
  ],
  kilnScripts = [
    'global/kiln-js/validators/index.js' // browserify requires the rest of the scripts
  ];

gulp.task('component-scripts', function () {
  return gulp.src(componentUtil.getComponentList('scripts'))
    // .pipe(sourcemaps.init({includeContent: true}))
    .pipe(ignore.include(hasFolderChanged(path.join('public', 'js', ':dirname:ext'), {
      parentName: files.getComponentName,
      parentDir: files.getComponentPath
    })))
    .pipe(map(function (code, filename, done) {
      var b, compiled;

      if (code.indexOf('require(') > -1) {
        // this bit of code is written in node format. browserify it!
        b = browserify({
          entries: filename,
          debug: true
        });
        compiled = '';

        b.bundle().on('data', function (chunk) {
          compiled += chunk;
        }).on('end', function () {
          done(null, compiled);
        });
      } else {
        done(null, code);
      }
    }))
    .pipe(groupConcat(componentUtil.getComponentScriptsMap()))
    // .pipe(uglify()).on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('global-scripts', function () {
  return gulp.src(globalScripts)
    // .pipe(sourcemaps.init({includeContent: true}))
    .pipe(concat('global.js'))
    // .pipe(uglify()).on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/js'));
});

// note: kiln scripts need browserify
gulp.task('kiln-scripts', function () {
  return gulp.src(kilnScripts)
    .pipe(map(function (code, filename, done) {
      var b, compiled;

      if (code.indexOf('require(') > -1) {
        // this bit of code is written in node format. browserify it!
        b = browserify({
          entries: filename,
          debug: true
        });
        compiled = '';

        b.bundle().on('data', function (chunk) {
          compiled += chunk;
        }).on('end', function () {
          done(null, compiled);
        });
      } else {
        done(null, code);
      }
    }))
    .pipe(concat('kiln-scripts.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('scripts', ['component-scripts', 'global-scripts', 'kiln-scripts']);
