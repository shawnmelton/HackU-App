/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

var args = arguments[0] || {};
var user = Ti.App.Properties.getObject('user', {});

// user lat, long.
$.map.region = {
  latitude: user.latitude,
  longitude: user.longitude,
  longitudeDelta: 0.01,
  latitudeDelta: 0.01
};

var annotation = Alloy.Globals.Map.createAnnotation({
  latitude: user.latitude,
  longitude: user.longitude,
  title: user.name,
  subtitle: user.homeAddress,
  pincolor: Alloy.Globals.Map.ANNOTATION_RED,
  animate: true,
  user: user
});

$.map.addAnnotation(annotation);
