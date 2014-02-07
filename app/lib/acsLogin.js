/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

var Cloud = require('ti.cloud');

module.exports = function (loginCredentials, callBack) {
  Cloud.debug = true;

  Cloud.Users.login({
    login: loginCredentials.emailId,
    password: loginCredentials.password,
  }, function (e) {
    if (e.success) {
      // user details.
      Ti.App.Properties.setObject('user', e.users[0]);
      callBack(e.users[0]);

    } else {
      console.log(JSON.stringify(e));
      callBack('failed');
    }
  });
};
