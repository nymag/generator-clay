'use strict';

var path = require('path'),
  generators = require('yeoman-generator'),
  helpers = generators.test,
  assert = generators.assert,
  folder = path.join('components', 'foo');

describe('clay:component', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, 'index.js'))
      .withArguments(['foo'])
      .withPrompts({ templateLang: 'nunjucks' })
      .on('end', done);
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
});

describe('clay:component --tag aside', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, 'index.js'))
      .withArguments(['foo'])
      .withOptions({ tag: 'aside' })
      .withPrompts({ templateLang: 'nunjucks' })
      .on('end', done);
  });

  it('allows tag option', function () {
    var file = path.join(folder, 'template.nunjucks');

    assert.file(file);
    assert.fileContent(file, /^<aside/);
  });
});
