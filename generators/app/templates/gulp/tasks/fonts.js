'use strict';

var gulp = require('gulp'),
  es = require('event-stream'),
  concat = require('gulp-concat'),
  newer = require('gulp-newer'),
  getFolders = require('../util/folders');

// base64 encode and inline fonts
gulp.task('fonts', function () {
  var sites = getFolders('sites/'),
    tasks = sites.map(function (site) {

      // loop through the sites
      return gulp.src('sites/' + site + '/fonts/*.woff')
        // if one font in the site folder is changed, recompile all fonts
        .pipe(newer('public/fonts/combined-' + site + '.css'))
        // base64 encode the fonts
        .pipe(es.map(function (file, cb) {
          var pathArr = file.path.split('/'),
            fileName = pathArr[pathArr.length - 1].split('.')[0],
            fontName = fileName.split('-')[0],
            attr = fileName.split('-')[1] ? fileName.split('-')[1] : '',
            fontData = file.contents.toString('base64'),
            fontCSS = '@font-face { font-family: "' + fontName + '"; '; // start building the font css

          if (attr.indexOf('Italic') !== -1) {
            fontCSS += 'font-style: italic; '; // e.g. AkzidenzGrotesk-Italic.woff
          }

          if (attr.indexOf('Bold') !== -1) {
            fontCSS += 'font-weight: bold; '; // e.g. HelveticaNeue-Bold.woff
          }

          fontCSS += 'src: url(data:font/woff;charset=utf-8;base64,' + fontData + ') format("woff"); }';

          file.contents = new Buffer(fontCSS);

          return cb(null, file);
        }))
        // dump that to public/fonts/combined-site.css
        .pipe(concat('combined-' + site + '.css'))
        .pipe(gulp.dest('public/fonts'));
    });

  return es.merge.apply(null, tasks);
});
