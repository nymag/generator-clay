'use strict';

var amphora = require('@nymdev/amphora'),
  port = process.env.PORT || 3001;

return amphora().then(function (router) {
  router.listen(port);
  console.log('Clay listening on port ' + port);
}).catch(function (e) {
  console.log(e);
});
