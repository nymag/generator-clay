'use strict';

/**
 * mount routes onto your site
 * @param {express.Router} site
 * @param {Function} composer (calls amphora and composes the page)
 * @returns {express.Router} site
 */
module.exports = function (site, composer) {
  // add your routes below. we've added one for you
  // note: `site` is just an express router
  site.get('/', composer);

  return site;
};
