'use strict';
var gulp = require('gulp');

gulp.task('watch', function () {
  // styles
  gulp.watch(['components/**/*.css', 'components/**/*.scss'], ['component-styles']);
  gulp.watch(['sites/**/components/**/*.css', 'sites/**/components/**/*.scss'], ['contextual-styles']);

  // scripts
  gulp.watch(['global/js/**', '!global/js/editor/*.js'], ['global-scripts']);
  gulp.watch('components/**/client.js', ['component-scripts']);

  // media
  gulp.watch('components/**/media/**', ['component-media']);
  gulp.watch('sites/**/media/**', ['site-media']);

  // fonts
  gulp.watch('sites/**/fonts/**', ['fonts']);
});
