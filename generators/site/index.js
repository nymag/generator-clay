'use strict';

var generators = require('yeoman-generator');

module.exports = generators.NamedBase.extend({
  constructor: function () {
    generators.NamedBase.apply(this, arguments);
  },

  method1: function () {
    console.log('generating new site: ' + this.name);
  }
});
