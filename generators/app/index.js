'use strict';

var generators = require('yeoman-generator'),
  chalk = require('chalk');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  notImplemented: function () {
    this.log(chalk.red('Clay instance generator has not been implemented yet.'));
    this.log(chalk.bgRed.bold('It\'s coming soon!'));
    process.exit(1);
  }
});
