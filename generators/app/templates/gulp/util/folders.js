'use strict';

var _ = require('lodash'),
  fs = require('fs'),
  path = require('path');

// get folders (used for getting site folders, etc)
module.exports = _.memoize(function (dir) {
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
});
