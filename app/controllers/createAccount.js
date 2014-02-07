/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

var args = arguments[0] || {};
var acsAccount = require('acsAccount');

// utility modules.

// validate user.
// create an a/c in acs.
// return success.
// store in the app properties(email id).
function acsSuccess() {
  console.log('now, call the next window');
}

function createAccount(event) {
  var name, emailId, password, homeAddress, company,
      newUser, latitude, longitude;

  name = $.name.value;
  emailId = $.emailId.value;
  password = $.password.value;
  homeAddress = $.homeAddress.value;
  company = $.company.value || 'Dominion Enterprises';

  if (!name || !emailId || !password || !homeAddress || !company) {

    alert('All fields required.');
    return;
  }

  Ti.Geolocation.forwardGeocoder(homeAddress, function (event) {
    latitude = event.latitude;
    longitude = event.longitude;

    newUser = {
      name : $.name.value,
      emailId : $.emailId.value,
      password : $.password.value,
      homeAddress : $.homeAddress.value,
      latitude: latitude || '',
      longitude: longitude || '', // reverse geocode address.
      company : $.company.value || 'Dominion Enterprises'
    };

    acsAccount(newUser, function (event) {
      if (event === 'success') {
        // $.createAccount.close();
        Alloy.createController('mapView').getView().open();

      } else {
        Ti.UI.createAlertDialog({
          title: 'Account creation',
          message: 'Please, try again later.'
        }).show();
      }
    });
  });
}

function accountLogin() {

  Alloy.createController('loginUser').getView().open();
}

/**
 * Populate form fields with the appropriate form informaiton.
 */

function linkAccount() {
  var api = require('linkedInAPI');
  api.getUser(function (user) {
    user = JSON.parse(user);
    Ti.API.info(user);
    $.name.value = user.firstName + ' ' + user.lastName;

    if(user.emailAddress) {
      $.emailId.value = user.emailAddress;
    }

    if (user.positions && user.positions.values[0]) {
      $.company.value = user.positions.values[0].company.name;
    }
  });
}
