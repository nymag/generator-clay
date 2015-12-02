'use strict';

var generators = require('yeoman-generator'),
  optionOrPrompt = require('yeoman-option-or-prompt'),
  fs = require('fs'),
  chalk = require('chalk'),
  _ = require('lodash'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  tagsHash = require('./tags.json'),
  viewportsHash = require('./viewports.json');

module.exports = generators.NamedBase.extend({
  _optionOrPrompt: optionOrPrompt,

  constructor: function () {
    generators.NamedBase.apply(this, arguments);

    // --tag option
    this.option('tag');
    this.tag = this.options.tag ? this.options.tag : 'section';
    // default tag to section if not specified

    // --viewports option
    this.option('viewports');
    this.viewports = this.options.viewports ? this.options.viewports.split(',') : [];
    // viewports defaults to empty array if not specified
    // note: it will ALWAYS create an all.css and print.css

    // --npm option, generates an npm component in the current directory
    // rather than putting it into components/
    // note: 'clay-' is automatically prepended to component name
    this.option('npm');
    this.isNPM = !!this.options.npm;
  },

  initializing: {
    checkComponent: function () {
      var name = this.name,
        isNPM = this.isNPM,
        hasComponentFolder = fs.existsSync(this.destinationPath('components', name)),
        // note: this.fs.exists() doesn't work for directories, hence fs.existsSync()
        hasNpmComponent;

      try {
        let pkg = require(this.destinationPath('package.json')),
          deps = pkg.dependencies;

        hasNpmComponent = _.contains(Object.keys(deps), 'clay-' + name);
      } catch (e) {
        hasNpmComponent = false;
      }

      if (!isNPM && hasComponentFolder) {
        this.log(chalk.red('Component already exists at components/' + name));
        process.exit(1);
      } else if (!isNPM && hasNpmComponent) {
        this.log(chalk.red('Component with a similar name was installed via npm: clay-' + name));
        process.exit(1);
      }
    }
  },

  prompting: {
    getTplExtension: function () {
      var done = this.async(),
        prompts = require('./prompts.js')();

      this._optionOrPrompt(prompts, function (props) {
        this.tplExtension = props.templateLang !== 'other' ? props.templateLang : props.customTemplateLang;

        done();
      }.bind(this));
    },

    getFields: function () {
      var done = this.async(),
        fields = [],
        promptsInputFields = require('./promptsInputFields.js')(),
        continueFn;


      // if they want to keep adding fields, recurse
      continueFn = function (answers) {
        if (answers.fieldName) {
          // add field they just defined to the fields array
          fields.push(answers.fieldName);
        }

        if (answers.addFields) {
          // keep going
          this._optionOrPrompt(promptsInputFields, continueFn.bind(this));
        } else {
          // finish up
          this.fields = fields;
          done();
        }
      }.bind(this);

      this._optionOrPrompt([{
        type: 'confirm',
        name: 'addFields',
        message: 'Add fields to generate a bootstrap and schema',
        default: true
      }], continueFn.bind(this));
    }
  },

  // getFolder runs after prompts, but before writing
  getFolder: function () {
    var name = this.name,
      isNPM = this.isNPM;

    // figure out what folder we should write to
    this.folder = isNPM ?
      this.destinationPath() :
      this.destinationPath('components', name);

    // folderName is used for the folder if it's an npm component,
    // as well as the class name
    this.folderName = isNPM ? 'clay-' + name : name;
  },

  writing: {
    createFolder: function () {
      var done = this.async(),
        log = this.log,
        folderName = this.folderName,
        folder = this.folder;

      // create components/<name> folder (creating the components folder if it doesn't exist)
      // or create clay-<name> folder if it's an npm component
      mkdirp(folder, function (err) {
        if (err) {
          log(chalk.red(err.message, err.stack));
          process.exit(0);
        } else {
          log(chalk.gray.underline(_.repeat(' ', 60)));
          log(chalk.bold('Generating new component: ') + chalk.bold.blue(folderName));
        }

        done();
      });
    },

    createDefaultStyles: function () {
      // create all.css and print.css
      var folderName = this.folderName,
        folder = this.folder,
        styles = [
          'all.css',
          'print.css'
        ];

      _.each(styles, function (style) {
        this.fs.copyTpl(this.templatePath(style), path.join(folder, style), { folderName: folderName });
      }.bind(this));
    },

    createViewportStyles: function () {
      // create stylesheets for any viewports specified in the options
      var folderName = this.folderName,
        folder = this.folder,
        viewports = this.viewports;

      _.each(viewports, function (viewport) {
        // if it's a named viewport (e.g. 'mobile'), grab the values
        viewport = viewportsHash[viewport] || viewport;

        this.fs.copyTpl(this.templatePath('all.css'), path.join(folder, viewport + '.css'), { folderName: folderName });
      }.bind(this));
    },

    createTemplate: function () {
      var tpl = 'template',
        ext = this.tplExtension,
        tag = this.tag,
        folderName = this.folderName,
        folder = this.folder;

      // we're gonna create the template with the tag specified (or the default)
      this.log(chalk.grey(_.startCase(tag) + ': ' + tagsHash[tag]));

      if (ext === 'nunjucks' || ext === 'jade') {
        // if it's nunjucks or jade, copy over the template
        this.fs.copyTpl(this.templatePath(tpl + '.' + ext), path.join(folder, tpl + '.' + ext), {
          folderName: folderName,
          tag: tag
        });
      } else {
        // otherwise create a blank file with that extension
        this.fs.write(path.join(folder, tpl + '.' + ext), '');
      }
    },

    createFields: function () {
      var fields = this.fields,
        folderName = this.folderName,
        folder = this.folder,
        log = this.log;

      if (fields.length) {
        log(chalk.grey('Fields: ' + fields.join(', ')));
      } else {
        log(chalk.grey('No fields, Creating blank schema and bootstrap'));
      }

      this.fs.copyTpl(this.templatePath('schema.yml'), path.join(folder, 'schema.yml'), { fields: fields });
      this.fs.copyTpl(this.templatePath('bootstrap.yml'), path.join(folder, 'bootstrap.yml'), { folderName: folderName, fields: fields });
    },

    updatePackage: function () {
      var isNPM = this.isNPM,
        folder = this.folder,
        folderName = this.folderName,
        ext = this.tplExtension,
        filePath = path.join(folder, 'package.json'),
        defaults = {
          name: folderName,
          template: 'template.' + ext,
          style: '*.css'
        },
        pkg;

      if (isNPM) {
        pkg = this.fs.readJSON(filePath, defaults);

        _.defaults(pkg, defaults);

        this.fs.writeJSON(filePath, pkg);
      }
    },

    addReadme: function () {
      var isNPM = this.isNPM,
        folder = this.folder,
        folderName = this.folderName,
        name = this.name,
        readmePath = path.join(folder, 'README.md'),
        hasReadme = this.fs.exists(readmePath);

      if (!hasReadme) {
        this.fs.copyTpl(this.templatePath('README.md'), readmePath, { folderName: folderName, name: name, isNPM: isNPM });
      }
    },

    addEslint: function () {
      var isNPM = this.isNPM,
        folder = this.folder,
        eslintPath = path.join(folder, '.eslintrc'),
        hasEslint = this.fs.exists(eslintPath);

      if (isNPM && !hasEslint) {
        this.fs.copy(this.templatePath('.eslintrc'), eslintPath);
      }
    }
  }
});
