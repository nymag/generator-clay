'use strict';

var path = require('path'),
  generators = require('yeoman-generator'),
  helpers = generators.test,
  assert = generators.assert,
  folder = path.join('components', 'foo'),
  viewportsHash = require('./viewports.json');

/**
 * run the generator with various options
 * @param {object} options (note: could be empty obj)
 * @param {Function} done async callback
 */
function runGenerator(options, done) {
  helpers.run(path.join(__dirname, 'index.js'))
    .withArguments(['foo'])
    .withOptions(options)
    .withPrompts({ templateLang: 'nunjucks', addFields: false })
    .on('end', done);
}

describe('clay:component', function () {
  describe('defaults', function () {
    before(function (done) {
      runGenerator({}, done);
    });

    it('generates a component folder', function () {
      assert.file(folder);
    });

    it('adds an all.css stylesheet', function () {
      var file = path.join(folder, 'all.css');

      assert.file(file);
      assert.fileContent(file, /^\.foo \{/);
    });

    it('adds a print.css stylesheet', function () {
      var file = path.join(folder, 'print.css');

      assert.file(file);
      assert.fileContent(file, /^\.foo \{/);
    });

    it('adds a template', function () {
      var file = path.join(folder, 'template.nunjucks');

      assert.file(file);
      assert.fileContent(file, /class="foo"/);
    });

    it('creates a non-npm readme if it doesn\'t exist', function () {
      var file = path.join(folder, 'README.md');

      assert.file(file);
      assert.fileContent(file, /foo/);
    });
  });

  describe('--tag', function () {
    before(function (done) {
      runGenerator({ tag: 'aside' }, done);
    });

    it('allows tag option', function () {
      var file = path.join(folder, 'template.nunjucks');

      assert.file(file);
      assert.fileContent(file, /^<aside/);
    });
  });

  describe('--viewports', function () {
    /**
     * test a named viewport (in the viewports hash)
     * @param {string} viewport
     * @param {Function} done async callback
     */
    function testViewport(viewport, done) {
      runGenerator({ viewports: viewport }, function () {
        assert.file(path.join(folder, viewportsHash[viewport] + '.css'));
        done();
      });
    }

    it('m', function (done) {
      testViewport('m', done);
    });

    it('mobile', function (done) {
      testViewport('mobile', done);
    });

    it('t', function (done) {
      testViewport('t', done);
    });

    it('tablet', function (done) {
      testViewport('tablet', done);
    });

    it('d', function (done) {
      testViewport('d', done);
    });

    it('desktop', function (done) {
      testViewport('desktop', done);
    });

    it('arbitrary', function (done) {
      runGenerator({ viewports: '0-200' }, function () {
        assert.file(path.join(folder, '0-200.css'));
        done();
      });
    });

    it('arbitrary, multiple', function (done) {
      runGenerator({ viewports: '0-300,300-600,600+' }, function () {
        assert.file(path.join(folder, '0-300.css'));
        assert.file(path.join(folder, '300-600.css'));
        assert.file(path.join(folder, '600+.css'));
        done();
      });
    });
  });

  describe('bootstrap and schema generation', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, 'index.js'))
        .withArguments(['foo'])
        .withPrompts({ templateLang: 'nunjucks', addFields: false, fieldName: 'headline' })
        .on('end', done);
    });

    it('generates schema.yml', function () {
      assert.file(path.join(folder, 'schema.yml'));
    });

    it('generates bootstrap.yml', function () {
      assert.file(path.join(folder, 'bootstrap.yml'));
    });
  });

  describe('--npm', function () {
    before(function (done) {
      runGenerator({ npm: true }, done);
    });

    it('adds an all.css stylesheet', function () {
      var file = 'all.css';

      assert.file(file);
      assert.fileContent(file, /^\.clay-foo \{/);
    });

    it('adds a print.css stylesheet', function () {
      var file = 'print.css';

      assert.file(file);
      assert.fileContent(file, /^\.clay-foo \{/);
    });

    it('adds a template', function () {
      var file = 'template.nunjucks';

      assert.file(file);
      assert.fileContent(file, /class="clay-foo"/);
    });

    it('adds template to package.json', function () {
      var file = 'package.json';

      assert.file(file);
      assert.fileContent(file, /"template": "template.nunjucks"/);
    });

    it('adds name to package.json', function () {
      var file = 'package.json';

      assert.file(file);
      assert.fileContent(file, /"name": "((.+?)\/)?clay-(.+?)"/);
    });

    it('adds style to package.json', function () {
      var file = 'package.json';

      assert.file(file);
      assert.fileContent(file, /"style": "\*\.css"/);
    });

    it('creates an npm readme if it doesn\'t exist', function () {
      var file = 'README.md';

      assert.file(file);
      assert.fileContent(file, /Install/);
    });

    it('creates eslintrc', function () {
      assert.file('.eslintrc');
    });
  });
});
