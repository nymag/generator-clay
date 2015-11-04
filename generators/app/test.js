'use strict';

var path = require('path'),
  generators = require('yeoman-generator'),
  helpers = generators.test,
  assert = generators.assert,
  appFiles = [
    'package.json',
    'README.md',
    'app.js',
    '.gitignore',
    '.eslintrc',
    'csscomb.json'
  ],
  folders = [
    'gulpfile.js',
    'gulp/tasks/default.js',
    'gulp/tasks/fonts.js',
    'gulp/tasks/media.js',
    'gulp/tasks/scripts.js',
    'gulp/tasks/styles.js',
    'gulp/tasks/watch.js',
    'gulp/util/components.js',
    'gulp/util/folders.js'
  ];

/**
 * run the generator with various options
 * @param {object} options (note: could be empty obj)
 * @param {Function} done async callback
 */
function runGenerator(options, done) {
  helpers.run(path.join(__dirname, 'index.js'))
    .withArguments(['newapp'])
    .withOptions(options)
    .withPrompts({ description: 'My new clay app instance', keywords: 'keyword1,keyword2'})
    .on('end', done);
}

describe('clay app', function () {
  describe('defaults', function () {
    before(function (done) {
      runGenerator({}, done);
    });

    it('generates a gulpfile.js, gulp/tasks, & gulp/util folders', function () {
      assert.file(folders);
    });

    it('generates application specific files', function () {
      assert.file(appFiles);
    });

  });
});
