'use strict';

var chalk = require('chalk'),
  findup = require('findup-sync'),
  _ = require('lodash');

module.exports = function (packageJson) {
  var prompts, exists, message, folderList = [];

  _.each(['sites', 'components', 'behaviors', 'validators'], function (folderName) {
    exists = findup(folderName) ? chalk.gray.dim('exists') : false;
    message = _.startCase(folderName) + ' Folder';

    folderList.push(
      {
        name: exists ? chalk.gray.dim(message) : message,
        value: folderName,
        checked: !exists,
        disabled: exists
      }
    );

  });

  prompts = [
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
      choices: folderList
    },
  ];

  return prompts;
};
