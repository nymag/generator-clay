'use strict';

var generators = require('yeoman-generator'),
    chalk = require('chalk'),
    _ = require('lodash');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.log('Welcome to the ' + chalk.yellow.bold('Clay Instance') + ' generator!');

    // Store user-inputed appname
    this.argument('appname', { type: String, required: false });
    this.appname = this.app_name || this.appname;
  },

  initializing: function () {
    this.packageJson = this.fs.readJSON(this.destinationPath('package.json'), {});
  },

  prompting: function () {
    var done = this.async(),
        prompts = require('./prompts.js')(this.packageJson);

    this.prompt(prompts, function (props) {
      this.props = props;

      done();
    }.bind(this));

  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          appname: this.appname
        }
      );

      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        {
          appname: this.appname
        }
      );

      this.fs.copy(
        this.templatePath('_app.js'),
        this.destinationPath('app.js')
      );
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    projectfiles: function () {
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
    this.log('Your app ' + chalk.yellow.bold(this.appname) + ' was created.');
  }
});
