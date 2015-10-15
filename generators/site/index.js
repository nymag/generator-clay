'use strict';

var generators = require('yeoman-generator'),
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  mkdirp = require('mkdirp'),
  _ = require('lodash');

module.exports = generators.NamedBase.extend({
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

  prompting: {
    getSiteConfig: function () {
      var done = this.async();

      this.prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the human-readable name of your site'
      }, {
        type: 'input',
        name: 'host',
        message: 'What is your site\'s domain name'
      }, {
        type: 'input',
        name: 'path',
        message: 'What is your site\'s path',
        default: '/',
        filter: function (input) {
          // add/remove slashes if the input is more than just '/'
          if (input === '/') {
            return input;
          }

          if (input.indexOf('/') !== 0) {
            // if it doesn't start with a slash, add one
            input = '/' + input;
          }

          if (input.lastIndexOf('/') === input.length - 1) {
            // if it ends with a slash, remove it
            input = input.substring(0, input.length - 1);
          }

          return input;
        }
      }], function (answers) {
        this.config = answers;
        done();
      }.bind(this));
    }
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
          log(chalk.dim.blue('-----------------------'));
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
