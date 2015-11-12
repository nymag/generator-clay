'use strict';

module.exports = function () {
  const prompts = [
    {
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
    },
    {
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
    }
  ];

  return prompts;
};
