'use strict';

var generators = require('yeoman-generator'),
  fs = require('fs'),
  chalk = require('chalk'),
  _ = require('lodash');

module.exports = generators.NamedBase.extend({
  constructor: function () {
    generators.NamedBase.apply(this, arguments);
  },

  initializing: {
    checkComponent: function () {
      var name = this.name,
        hasComponentFolder = fs.existsSync(this.destinationPath('components', name)),
        hasNpmComponent;

      try {
        let pkg = require(this.destinationPath('package.json')),
          deps = pkg.dependencies;

        hasNpmComponent = _.contains(Object.keys(deps), 'clay-' + name);
      } catch (e) {
        hasNpmComponent = false;
      }

      if (hasComponentFolder) {
        console.log(chalk.red('Component already exists at components/' + name));
        process.exit(1);
      } else if (hasNpmComponent) {
        console.log(chalk.red('Component with a similar name was installed via npm: clay-' + name));
        process.exit(1);
      } else {
        console.log(chalk.blue('Generating new component: ' + name));
      }
    }
  }
});
