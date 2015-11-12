'use strict';

const _ = require('lodash');

module.exports = function () {
  const prompts = [
    {
      type: 'input',
      name: 'fieldName',
      message: 'Input fields name (in camelCase)',
      validate: function (input) {
        return input === _.camelCase(input) ? true : 'Please use camelCase for your field name';
      },
      default:'testCase'
    },
    {
      type: 'confirm',
      name: 'addFields',
      message: 'Add more fields'
    }
  ];

  return prompts;
};
