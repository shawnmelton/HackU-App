/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

var args = arguments[0] || {};
var acsLogin = require('acsLogin');

function loginUser() {
  var emailId, password;
  emailId = $.emailId.value;
  password = $.password.value;

  if (! emailId || ! password) {

    Ti.UI.createAlertDialog({
      title: 'Required',
      message: 'All fields required.'
    }).show();
  }

  acsLogin({
    emailId: emailId,
    password: password
  }, function (event) {
    console.log(JSON.stringify(event));
    if (event !== 'failed') {
      Alloy.createController('mapView').getView().open();
    } else {
      Ti.UI.createAlertDialog({
        title: 'Account Login',
        message: 'Please, try again later.'
      }).show();
    }
  });
}
