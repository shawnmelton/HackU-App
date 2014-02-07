
Alloy.createController('createAccount').getView().open();
// $.index.open();

$.index.addEventListener('focus', function(e) {
  Ti.API.info('focused');
    var value = Ti.App.Properties.getString('payload');
    if (value){
       Ti.API.info(value);
       Titanium.App.Properties.removeProperty(value);
    }
});

// Require in the module
var CloudPush = require('ti.cloudpush');
var deviceToken = null;

// Initialize the module
CloudPush.retrieveDeviceToken({
  success : deviceTokenSuccess,
  error : deviceTokenError
});



// Enable push notifications for this device
// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {
  Ti.API.info('succesfuly registered');
  CloudPush.enabled = true;
  CloudPush.focusAppOnPush = true;
  CloudPush.showTrayNotification = true;
  CloudPush.showAppOnTrayClick = true;
  //CloudPush.showTrayNotificationsWhenFocused = true;
  //CloudPush.bubbleParent = true;
  deviceToken = e.deviceToken;
  Ti.App.Properties.setString('deviceToken', deviceToken);
}

function deviceTokenError(e) {
  alert('Failed to register for push notifications! ' + e.error);
}

// Process incoming push notifications
CloudPush.addEventListener('callback', function(evt) {

  Ti.API.info('recived message: ' + evt.payload);
  //toast.show();
  //createNotification(evt.payload);
  //Ti.App.Properties.setString('payload', evt.payload);
  var foc = $.index.getVisible( );
  if (foc){
    Ti.API.info('message: ' + evt.payload);
  }
});
