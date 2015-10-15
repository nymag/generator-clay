'use strict';

var generators = require('yeoman-generator'),
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  mkdirp = require('mkdirp');

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
    }
  }
});
