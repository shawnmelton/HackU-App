/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

var Cloud = require('ti.cloud');

module.exports = function (newUser, callBack) {
  Ti.API.info(newUser);
  Cloud.debug = true;

  Cloud.Users.create({
    username: newUser.emailId,
    email: newUser.emailId,
    password: newUser.password,
    password_confirmation: newUser.password,
    first_name: newUser.name,
    custom_fields: {
      address: newUser.homeAddress,
      coordinates : [ newUser.latitude, newUser.longitude],
      comapany : newUser.company
    }
  }, function (e) {
    if (e.success) {
      // success
      // store in app properties.
      Ti.App.Properties.setObject('user', newUser);
      callBack('success');
    } else {
      console.log(JSON.stringify(e));
      // try again.
      callBack('failed');
    }
  });
};
