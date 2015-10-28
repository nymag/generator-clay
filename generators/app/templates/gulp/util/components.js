'use strict';
var _ = require('lodash'),
  path = require('path'),
  files = require('@nymdev/amphora/lib/files'),
  cwd = process.cwd(),
  components = files.getComponents(),
  sites = files.getFolders('sites');

/**
 * get an map of css file globs, per component
 * @return {{}}
 */
function getComponentStylesMap() {
  return _.reduce(components, function (result, name) {
    var filePath = files.getComponentPath(name).substring(cwd.length + 1),
      npmStyles;

    if (_.contains(filePath, 'node_modules/')) {
      // style is from an npm module, look at the package.json
      npmStyles = require(path.join(cwd, filePath, 'package.json')).style; // get the npm styles. could be a string or array

      if (_.isArray(npmStyles)) {
        result[name + '.css'] = npmStyles.map(function (style) {
          // add the filepath to each style
          return path.join(filePath, style);
        });
      } else if (_.isString(npmStyles)) {
        result[name + '.css'] = path.join(filePath, npmStyles);
      } // else don't add the styles at all
    } else {
      result[name + '.css'] = [filePath + '/*.css', filePath + '/*.scss'];
    }

    return result;
  }, {});
}

/**
 * get an map of js file globs, per component
 * @return {{}}
 */
function getComponentScriptsMap() {
  return _.reduce(components, function (result, name) {
    var filePath = files.getComponentPath(name).substring(cwd.length + 1),
      npmScripts;

    if (_.contains(filePath, 'node_modules/')) {
      // script is from an npm module, look at the package.json
      npmScripts = require(path.join(cwd, filePath, 'package.json')).browser;

      if (_.isString(npmScripts)) {
        result[name + '.js'] = filePath + '/' + npmScripts;
      } // else don't add the scripts
    } else {
      result[name + '.js'] = filePath + '/client.js';
    }

    return result;
  }, {});
}

/**
 * gets a map of media file globs, per component
 * @return {{}}
 */
function getComponentMediaMap() {
  return _.reduce(components, function (result, name) {
    var filePath = files.getComponentPath(name).substring(cwd.length + 1);

    result[name] = filePath + '/media/**';
    return result;
  }, {});
}

/**
 * gets a list of css/js file globs for all components
 * @param  {string} type style/script
 * @return {[]}
 */
function getComponentList(type) {
  var map;

  if (type === 'scripts') {
    map = getComponentScriptsMap();
  } else if (type === 'styles') {
    map = getComponentStylesMap();
  } else if (type === 'media') {
    map = getComponentMediaMap();
  }

  return _.flatten(_.values(map));
}

/**
 * gets a map of css file globs for contextual components
 * @return {{}}
 */
function getContextualComponentMap() {
  return _.reduce(sites, function (result, site) {
    // for each site, iterate over the components that have contextual stuff
    return _.reduce(components, function (reduced, component) {
      var folderPath = path.join('sites', site, 'components', component);

      reduced[component + '.' + site + '.css'] = [folderPath + path.sep + '*.css', folderPath + path.sep + '*.scss'];
      return reduced;
    }, result);
  }, {});
}

/**
 * gets a list of all contextual css file globs that exist
 * @return {[]}
 */
function getContextualComponentList() {
  var list = _.flatten(_.values(getContextualComponentMap()));

  return list;
}

/**
 * gets the component name from a contextual component path
 * @param  {string} filePath e.g. "sites/mysite/components/foo/*.css"
 * @return {string}          e.g. "foo"
 */
function getContextualComponentName(filePath) {
  var pathArr = filePath.split(path.sep);

  return pathArr[pathArr.indexOf('components') + 1] + '.' + pathArr[pathArr.indexOf('sites') + 1];
}

// todo: this "works", but doesn't allow component css to reference the containing (component) element itself
// I commented it out until we've got a clear vision about how to handle that

// /**
//  * wrap each css rule in [data-component="<name>"]
//  * @param  {Buffer} contents
//  * @param  {string} filename
//  * @return {Buffer}
//  */
// function wrapComponentName(file, encoding, cb) {
//   var componentName = _.last(path.dirname(file.path).split('/')),
//     stringContents = file.contents.toString(),
//     cssRule = /([\.#]?.*)(\s?[,\{]\n)/g,
//     componentCssRule = '[data-component="' + componentName + '"] $1$2',
//     newStringContents = stringContents.replace(cssRule, componentCssRule);

//   file.contents = new Buffer(newStringContents);
//   cb(null, file);
// }

exports.getComponentStylesMap = getComponentStylesMap;
exports.getComponentScriptsMap = getComponentScriptsMap;
exports.getComponentMediaMap = getComponentMediaMap;
exports.getComponentList = getComponentList;
exports.getContextualComponentMap = getContextualComponentMap;
exports.getContextualComponentList = getContextualComponentList;
exports.getContextualComponentName = getContextualComponentName;
