'use strict';

var generators = require('yeoman-generator'),
  fs = require('fs'),
  chalk = require('chalk'),
  _ = require('lodash'),
  path = require('path'),
  mkdirp = require('mkdirp');

module.exports = generators.NamedBase.extend({
  constructor: function () {
    generators.NamedBase.apply(this, arguments);
  },

  initializing: {
    checkComponent: function () {
      var name = this.name,
        hasComponentFolder = fs.existsSync(this.destinationPath('components', name)),
        // note: this.fs.exists() doesn't work for directories
        hasNpmComponent;

      try {
        let pkg = require(this.destinationPath('package.json')),
          deps = pkg.dependencies;

        hasNpmComponent = _.contains(Object.keys(deps), 'clay-' + name);
      } catch (e) {
        hasNpmComponent = false;
      }

      if (hasComponentFolder) {
        this.log(chalk.red('Component already exists at components/' + name));
        process.exit(1);
      } else if (hasNpmComponent) {
        this.log(chalk.red('Component with a similar name was installed via npm: clay-' + name));
        process.exit(1);
      } else {
        this.log(chalk.blue('Generating new component: ' + name));
      }
    }
  },

  writing: {
    createFolder: function () {
      var done = this.async(),
        log = this.log;

      mkdirp(this.destinationPath('components', this.name), function (err) {
        if (err) {
          log(chalk.red(err.message));
          process.exit(0);
        }

        done();
      });
    },

    createStyles: function () {
      // create all.css and print.css
      var name = this.name,
        folder = this.destinationPath('components', name),
        styles = [
          'all.css',
          'print.css'
        ];

      _.each(styles, function (style) {
        this.fs.copyTpl(this.templatePath(style), path.join(folder, style), { name: name });
      }.bind(this));
    }
  }
});
