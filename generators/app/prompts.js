'use strict';

var chalk = require('chalk'),
  findup = require('findup-sync'),
  _ = require('lodash');

module.exports = function (packageJson) {
  var prompts = [
    {
      type: 'input',
      name: 'description',
      message: chalk.blue('No description found. Please enter one.\n') + 'Description',
      default: 'Clay instance',
      when: !packageJson.description
    },
    {
      type: 'input',
      name: 'keywords',
      message: chalk.blue('No keywords found. Please enter them.\n') + 'Package keywords (comma to split)',
      when: !packageJson.keywords || _.isEmpty(packageJson.keywords),
      default: 'clay, instance',
      filter: _.words
    },
    {
      type:'checkbox',
      name:'folders',
      message:'\n\nWhich folders would you like to create?',
      choices:[
        {
          name: 'Sites Folder',
          value: 'sites',
          checked: !findup('sites')
        },
        {
          name: 'Components Folder',
          value: 'components',
          checked: !findup('components')
        },
        {
          name: 'Behaviors Folder',
          value: 'behaviors',
          checked: !findup('behaviors')
        },
        {
          name: 'Validators Folder',
          value: 'validators',
          checked: !findup('validators')
        }
      ]
    },
  ];

  return prompts;
};
