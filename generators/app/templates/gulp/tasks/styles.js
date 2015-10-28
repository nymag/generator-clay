'use strict';
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  ignore = require('gulp-ignore'),
  hasFolderChanged = require('gulp-folder-changed'),
  rfn = require('responsive-filenames'),
  groupConcat = require('gulp-group-concat'),
  autoprefix = require('gulp-autoprefixer'),
  cssmin = require('gulp-cssmin'),
  path = require('path'),
  files = require('@nymdev/amphora/lib/files'),
  componentUtil = require('../util/components'),
  prefixOptions = { browsers: ['last 2 versions', 'ie >= 9', 'ios >= 7', 'android >= 4.4.2'] };

gulp.task('component-styles', function () {
  return gulp.src(componentUtil.getComponentList('styles'))
    .pipe(ignore.include(hasFolderChanged(path.join('public', 'css', '+(:dirname|:dirname.*).css'), {
      parentName: files.getComponentName,
      parentDir: files.getComponentPath
    })))
    .pipe(sass().on('error', sass.logError))
    .pipe(rfn())
    // .pipe(aside('!**/node_modules/**', wrapComponentName))
    .pipe(groupConcat(componentUtil.getComponentStylesMap()))
    .pipe(autoprefix(prefixOptions))
    .pipe(cssmin())
    .pipe(gulp.dest('public/css'));
});

gulp.task('contextual-styles', function () {
  return gulp.src(componentUtil.getContextualComponentList())
    .pipe(ignore.include(hasFolderChanged(path.join('public', 'css', '+(:dirname|:dirname.*).css'), {
      parentName: componentUtil.getContextualComponentName
    })))
    .pipe(sass().on('error', sass.logError))
    .pipe(rfn())
    .pipe(groupConcat(componentUtil.getContextualComponentMap()))
    .pipe(autoprefix(prefixOptions))
    .pipe(cssmin())
    .pipe(gulp.dest('public/css'));
});

gulp.task('styles', ['component-styles', 'contextual-styles']);
