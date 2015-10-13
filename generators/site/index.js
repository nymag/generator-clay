'use strict';

var generators = require('yeoman-generator'),
  fs = require('fs'),
  chalk = require('chalk');

module.exports = generators.NamedBase.extend({
  constructor: function () {
    generators.NamedBase.apply(this, arguments);
  },

  initializing: {
    checkSite: function () {
      var name = this.name,
        hasSiteFolder = fs.existsSync(this.destinationPath('sites', name));

      if (hasSiteFolder) {
        console.log(chalk.red('Site already exists!'));
      } else {
        console.log(chalk.blue('Generating new site: ' + name));
      }
    }
  }
});
