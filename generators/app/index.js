'use strict';

var generators = require('yeoman-generator'),
  chalk = require('chalk'),
  mkdirp = require('mkdirp'),
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
    this.packageJson = this.fs.readJSON(this.destinationPath('package.json'),{});

    // Helper function to check if dependency exists
    this.checkDeps = function (depsObject, whereToLook) {
      var pkg = this.packageJson;

      return _.chain(depsObject)
      // Checks if dependency exist
      .pick(function (value, name) {
        var hasModule = !_.has(pkg[whereToLook], name);

        if (hasModule) {
          console.log(chalk.cyan(name) + chalk.cyan.bold(' does not exist: ') + value);
        }
        return hasModule;
      })
      // Maps module to module@version (i.e `gulp` -> `gulp@3.8.11`)
      .mapKeys(function (moduleVerison, moduleName) {
        return moduleName + moduleVerison.replace('\^','@');
      })
      // Returns the keys
      .keys()
      .value();
    };
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
    packageJson: function () {
      var currentPackageJson,
        msg,
        newPackageJson = {},
        packageJsonOrder = ['name','version','description','license','main','scripts','keywords','repository','dependencies','devDependencies'];

      // Sets a field in package.json if it doesn't exist
      this.setPackageJsonField = function (field) {
        if (!this.packageJson[field]) {
          this.packageJson[field] = this.props[field];
        } else {
          msg = _.endsWith(field, 's') ? ' exist: ' : ' exists: ';
          console.log(chalk.blue(field) + chalk.blue.bold(msg) + this.packageJson[field]);
        }
      };

      if (this.fs.exists(this.destinationPath('package.json'))) {
        this.log(chalk.yellow('package.json') + ' found. Revising it.');
        this.packageJson = this.fs.readJSON(this.destinationPath('package.json'),{});

        this.setPackageJsonField('description');
        this.setPackageJsonField('keywords');

        currentPackageJson = this.packageJson;

        // Re-order fiels in pre-specified order
        _.each(packageJsonOrder, function (key) {
          newPackageJson[key] = currentPackageJson[key];
        });

        this.fs.writeJSON('package.json', newPackageJson);

      } else {
        this.log('No ' + chalk.red('package.json') + ' found. Creating one.');
        this.fs.copyTpl(
          this.templatePath('_package.json'),
          this.destinationPath('package.json'),
          {
            appname: this.appname,
            description: this.props.description,
            keywords: this.props.keywords
          }
        );
      }
    },

    createFolders: function () {
      var done = this.async(),
        log = this.log,
        folders = ['sites', 'components', 'behaviors', 'validators'];

      if (folders) {
        log('Generating ' + chalk.blue(folders));
      }

      // Create app folders
      _.each(folders, function (name) {
        mkdirp(name, function (err) {
          if (err) {
            log(chalk.red(err.message, err.stack));
            process.exit(0);
          }

          done();
        });
      });

    },

    gulp: function () {
      this.fs.copy(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );
      this.log('Generating ' + chalk.yellow.bold('gulpfile.js'));

      // Creates gulp/tasks & gulp/utils
      this.directory(
        this.templatePath('gulp'),
        this.destinationPath('gulp')
      );
      this.log('Generating ' + chalk.yellow.bold('gulp folders.'));
    },

    tests: function () {
      // Creates tests/mocha.opts
      this.directory(
        this.templatePath('test'),
        this.destinationPath('test')
      );
      this.log('Generating ' + chalk.yellow.bold('test folder.'));
    },

    app: function () {
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
  install: {
    app: function () {
      // Check if main dependencies exist
      var mainDependencies = require('./mainDeps.json');

      mainDependencies = this.checkDeps(mainDependencies,'dependencies');
      this.npmInstall(mainDependencies, { 'save': true });
      this.log('Installed ' + chalk.yellow.bold('main dependencies.'));
    },

    gulp: function () {
      // Check if gulp dependencies exist
      var gulpDependencies = require('./gulpDeps.json');

      gulpDependencies = this.checkDeps(gulpDependencies, 'dependencies');
      this.npmInstall(gulpDependencies, { 'save': true });
      this.log('Installed ' + chalk.yellow.bold('gulp dependencies.'));
    },

    devDeps: function () {
      // Check if devDependencies exist
      var devDependencies = require('./devDeps.json');

      devDependencies = this.checkDeps(devDependencies, 'devDependencies');
      this.npmInstall(devDependencies, { 'saveDev': true });
      this.log('Installed ' + chalk.yellow.bold('dev dependencies.'));
    },

    main: function () {
      this.npmInstall();
      this.log('Your app ' + chalk.yellow.bold(this.appname) + ' was created.');
    }
  }
});
