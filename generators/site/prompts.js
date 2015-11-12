'use strict';

const _ = require('lodash');

function fixInputSlashes(input) {
  // add/remove slashes if the input is more than just '/'
  if (input === '/') {
    return input;
  }

  if (!_.startsWith(input, '/')) {
    // if it doesn't start with a slash, add one
    input = '/' + input;
  }

  if (_.endsWith(input, '/')) {
    // if it ends with a slash, remove it
    input = input.substring(0, input.length - 1);
  }

  return input;
};

module.exports = function () {
  const prompts = [
    {
      type: 'input',
      name: 'name',
      message: 'What is the human-readable name of your site'
    },
    {
      type: 'input',
      name: 'host',
      message: 'What is your site\'s domain name'
    },
    {
      type: 'input',
      name: 'path',
      message: 'What is your site\'s path',
      default: '/',
      filter: fixInputSlashes
    }
  ];

  return prompts;
};
