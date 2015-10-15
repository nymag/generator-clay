'use strict';

var path = require('path'),
  generators = require('yeoman-generator'),
  helpers = generators.test,
  assert = generators.assert,
  folder = path.join('sites', 'foo');

/**
 * run the generator with various options
 * @param {object} options (note: could be empty obj)
 * @param {Function} done async callback
 */
function runGenerator(options, done) {
  helpers.run(path.join(__dirname, 'index.js'))
    .withArguments(['foo'])
    .withOptions(options)
    .on('end', done);
}

describe('clay:site', function () {
  describe('defaults', function () {
    before(function (done) {
      runGenerator({}, done);
    });

    it('generates a site folder', function () {
      assert.file(folder);
    });

    it('adds an index.js with basic route', function () {
      assert.file(path.join(folder, 'index.js'));
    });

    it('adds an local.yml with host', function () {
      assert.file(path.join(folder, 'local.yml'));
    });
  });
});
