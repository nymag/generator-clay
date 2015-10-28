'use strict';

// note: tasks for gulp are pulled from gulp/tasks
// note: utils functions for gulp are pulled from gulp/util
var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });
