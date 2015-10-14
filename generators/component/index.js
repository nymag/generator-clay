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

  prompting: {
    getTplExtension: function () {
      var done = this.async();

      this.prompt([{
        // ask for the template language
        type: 'list',
        name: 'templateLang',
        message: 'What templating language do you want to use?',
        default: 'nunjucks',
        choices: [{
          name: 'Nunjucks',
          value: 'nunjucks'
        }, {
          name: 'Jade',
          value: 'jade'
        }, {
          name: 'Other (enter on next prompt)',
          value: 'other'
        }],
        store: true // store their defaults for the next time they use this
      }, {
        // ask for custom template language if they answered 'other'
        type: 'input',
        name: 'customTemplateLang',
        message: 'Please type the extension you want',
        filter: function (input) {
          return input.indexOf('.') === 0 ? input.replace('.', '') : input;
          // remove dot if they type it, e.g. .ejs -> ejs
        },
        when: function (answers) {
          return answers.templateLang === 'other';
        }
      }], function (answers) {
        this.tplExtension = answers.templateLang !== 'other' ? answers.templateLang : answers.customTemplateLang;
        done();
      }.bind(this));
    }
  },

  writing: {
    createFolder: function () {
      var done = this.async(),
        log = this.log;

      // create components/<name> folder (creating the components folder if it doesn't exist)
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
    },

    createTemplate: function () {
      var tpl = 'template',
        ext = this.tplExtension,
        name = this.name,
        folder = this.destinationPath('components', name);

      if (ext === 'nunjucks' || ext === 'jade') {
        // if it's nunjucks or jade, copy over the template
        this.fs.copyTpl(this.templatePath(tpl + '.' + ext), path.join(folder, tpl + '.' + ext), { name: name });
      } else {
        // otherwise create a blank file with that extension
        this.fs.write(path.join(folder, tpl + '.' + ext), '');
      }
    }
  }
});
