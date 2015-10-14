'use strict';

var path = require('path'),
  generators = require('yeoman-generator'),
  helpers = generators.test,
  assert = generators.assert;

describe('clay:component', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, 'index.js'))
      .withArguments(['foo'])
      .on('end', done);
  });

  it('generates a component folder', function () {
    assert.file('components/foo');
  });

  it('adds an all.css stylesheet', function () {
    var file = 'components/foo/all.css';

    assert.file(file);
    assert.fileContent(file, /^\.foo \{/);
  });

  it('adds a print.css stylesheet', function () {
    var file = 'components/foo/print.css';

    assert.file(file);
    assert.fileContent(file, /^\.foo \{/);
  });
});
