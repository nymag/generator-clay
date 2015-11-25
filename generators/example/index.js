'use strict';

var generators = require('yeoman-generator'),
  chalk = require('chalk'),
  example = {
    appName: 'example',
    componentName: 'hello-world',
    siteName: 'test'
  };

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    console.log(chalk.blue('You called the subgenerator for `' + chalk.bold.yellow('example') + '`.'));
  },
  writing: {
    createInstance: function () {
      this.log('Create instance: ', example.appName);
      this.composeWith('clay:app',
        {
          options: {
            description: 'This is an example description for this package.json.',
            keywords: 'example, generators'
          },
          args: [example.appName]
        }
      );
    },
    createComponent: function () {
      this.log('Create component: ', example.componentName);
      this.composeWith('clay:component',
        {
          options: {
            templateLang: 'nunjucks',
            addFields: true,
            fieldName: 'headline',
            addMoreFields: false,
          },
          args: [example.componentName]
        }
      );
    },
    createSite: function () {
      this.log('Create site: ', example.siteName);
      this.composeWith('clay:site',
        {
          options: {
            name: 'My Example Blog',
            host: 'myexample.com',
            path: '/mysite'
          },
          args: [example.siteName]
        }
      );
    }
  }
});
