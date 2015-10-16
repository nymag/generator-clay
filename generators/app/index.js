'use strict';

var generators = require('yeoman-generator'),
  chalk = require('chalk');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  copying: function () {
    this.copy('_gitignore', '.' + 'gitignore');
    this.copy('_csscomb.json', '.' + 'csscomb.json');
    this.copy('_eslintrc', '.' + 'eslintrc');
  },

  notImplemented: function () {
    this.log(chalk.red('Clay instance generator has not been implemented yet.'));
    this.log(chalk.bgRed.bold('It\'s coming soon!'));
    // process.exit(1);
  }
});
