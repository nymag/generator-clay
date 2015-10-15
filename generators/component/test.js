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
    .withPrompts({ templateLang: 'nunjucks' })
    .on('end', done);
}

describe('clay:component', function () {
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
});

// tags option
describe('clay:component --tag aside', function () {
  before(function (done) {
    runGenerator({ tag: 'aside' }, done);
  });

  it('allows tag option', function () {
    var file = path.join(folder, 'template.nunjucks');

    assert.file(file);
    assert.fileContent(file, /^<aside/);
  });
});

// viewports options
describe('clay:component --viewports m', function () {
  before(function (done) {
    runGenerator({ viewports: 'm' }, done);
  });

  it('creates mobile viewport', function () {
    assert.file(path.join(folder, viewportsHash.m + '.css'));
  });
});

describe('clay:component --viewports mobile', function () {
  before(function (done) {
    runGenerator({ viewports: 'mobile' }, done);
  });

  it('creates mobile viewport', function () {
    assert.file(path.join(folder, viewportsHash.mobile + '.css'));
  });
});

describe('clay:component --viewports t', function () {
  before(function (done) {
    runGenerator({ viewports: 't' }, done);
  });

  it('creates tablet viewport', function () {
    assert.file(path.join(folder, viewportsHash.t + '.css'));
  });
});

describe('clay:component --viewports tablet', function () {
  before(function (done) {
    runGenerator({ viewports: 'tablet' }, done);
  });

  it('creates tablet viewport', function () {
    assert.file(path.join(folder, viewportsHash.tablet + '.css'));
  });
});

describe('clay:component --viewports d', function () {
  before(function (done) {
    runGenerator({ viewports: 'd' }, done);
  });

  it('creates desktop viewport', function () {
    assert.file(path.join(folder, viewportsHash.d + '.css'));
  });
});

describe('clay:component --viewports desktop', function () {
  before(function (done) {
    runGenerator({ viewports: 'desktop' }, done);
  });

  it('creates desktop viewport', function () {
    assert.file(path.join(folder, viewportsHash.desktop + '.css'));
  });
});

describe('clay:component --viewports 0-200', function () {
  before(function (done) {
    runGenerator({ viewports: '0-200' }, done);
  });

  it('creates arbitrary viewport', function () {
    assert.file(path.join(folder, '0-200.css'));
  });
});

describe('clay:component --viewports 0-300,300-600,600+', function () {
  before(function (done) {
    runGenerator({ viewports: '0-300,300-600,600+' }, done);
  });

  it('creates arbitrary viewports', function () {
    assert.file(path.join(folder, '0-300.css'));
    assert.file(path.join(folder, '300-600.css'));
    assert.file(path.join(folder, '600+.css'));
  });
});
