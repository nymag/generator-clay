'use strict';

var generators = require('yeoman-generator'),
  optionOrPrompt = require('yeoman-option-or-prompt'),
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  mkdirp = require('mkdirp'),
  _ = require('lodash');

module.exports = generators.NamedBase.extend({
  _optionOrPrompt: optionOrPrompt,

  constructor: function () {
    generators.NamedBase.apply(this, arguments);
  },

  initializing: {
    checkSite: function () {
      var name = this.name,
        hasSiteFolder = fs.existsSync(this.destinationPath('sites', name));
        // note: this.fs.exists() doesn't work for directories

      if (hasSiteFolder) {
        this.log(chalk.red('Site already exists at sites/' + name));
        process.exit(1);
      }
    }
  },

  prompting: function () {
    // Gets site config
    var done = this.async(),
      prompts = require('./prompts.js')();

    this._optionOrPrompt(prompts, function (props) {
      this.config = props;

      done();
    }.bind(this));
  },

  writing: {
    createFolder: function () {
      var done = this.async(),
        log = this.log,
        name = this.name;

      // create sites/<name> folder (creating the sites folder if it doesn't exist)
      mkdirp(this.destinationPath('sites', name), function (err) {
        if (err) {
          log(chalk.red(err.message));
          process.exit(0);
        } else {
          log(chalk.gray.underline(_.repeat(' ', 60)));
          log(chalk.bold('Generating new site: ') + chalk.bold.blue(name));
        }

        done();
      });
    },

    createIndex: function () {
      var name = this.name,
        folder = this.destinationPath('sites', name);

      this.fs.copy(this.templatePath('index.js'), path.join(folder, 'index.js'));
    },

    createLocalConfig: function () {
      var name = this.name,
        folder = this.destinationPath('sites', name);

      this.fs.copy(this.templatePath('local.yml'), path.join(folder, 'local.yml'));
    },

    createSiteConfig: function () {
      var name = this.name,
        folder = this.destinationPath('sites', name),
        config = this.config;

      // add any defaults we don't want to expose as prompts
      _.defaults(config, {
        assetDir: 'public',
        assetPath: config.path
      });

      this.fs.copyTpl(this.templatePath('config.yml'), path.join(folder, 'config.yml'), config);
    }
  }
});
