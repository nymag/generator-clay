'use strict';

var generators = require('yeoman-generator'),
  chalk = require('chalk');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.log('Welcome to the ' + chalk.yellow.bold('Clay Instance') + ' generator!');
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_app.js'),
        this.destinationPath('app.js')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );
      this.fs.copy(
        this.templatePath('_csscomb.json'),
        this.destinationPath('csscomb.json')
      );
    }
  },

  // Run npm install
  install: function () {
    this.npmInstall();
  }
});
