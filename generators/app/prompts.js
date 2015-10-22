
var chalk = require('chalk'),
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
    }
  ];

  return prompts;
}
