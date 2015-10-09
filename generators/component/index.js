'use strict';

var generators = require('yeoman-generator');

module.exports = generators.NamedBase.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  method1: function () {
    console.log('hello!');
  }
});
