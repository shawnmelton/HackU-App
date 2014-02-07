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



//auto complete for address
var searchArray = ['','','',''];
var clearArray=[''];
var numSuggestions;
var response = {};
var isSearched = false;

 //Table view showing your autocomplete values
var tblvAutoComplete = Ti.UI.createTableView({
    width           : '100%',
    backgroundColor : '#EFEFEF',
    height          : 80,
    maxRowHeight    : 35,
    minRowHeight    : 35,
    allowSelection  : true,
    bottom 			: 0,
    visible         : false
});


$.createAccount.add(tblvAutoComplete);
tblvAutoComplete.hide(); 

$.homeAddress.addEventListener('change', function(e){
	var pattern = '';
    var pattern = e.source.value;
    
    if(pattern.length>3 && isSearched === false)
    {	   
		var address = "5115 Hampton Blvd, Norfolk, VA 23529"; //"1049 W 49TH ST NORFOLK VA - 23508"; //$.address.value;
		var url = "http://utilitynode-ext.homes.com/v1/autocomplete/address?input="+pattern+"&api_key=000000000000000000000000000000";
		var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			response = JSON.parse(this.responseText);
		
			numSuggestions = response.suggestions.length;	
			
			   if(numSuggestions>1)
			   { 
			   	    Ti.API.info("Found some result   " + numSuggestions);
			   		
			   	    tblvAutoComplete.show(); 
				    for(i=0;i<numSuggestions;i++)
				    {
				    	searchArray[i]=response.suggestions[i].address;
				    }
			   	    var tempArray = PatternMatch(searchArray, pattern);
				    console.log(tempArray);
				    CreateAutoCompleteList(tempArray);		    
			    }
			    else
			    {
				    tblvAutoComplete.hide(); 
				    CreateAutoCompleteList(clearArray);
			    }	     
			},
			onerror : function(e) {
				Ti.API.info("Error: " + e.error);
				alert("Error: " + e.error);
			},
			timeout : 45000
		});
		
		client.open("GET", url);
		client.send();   
    }
	else
	{
		tblvAutoComplete.hide();
   }
});


//You got the required value and you clicks the word
tblvAutoComplete.addEventListener('click', function(e){
console.log("assigning now");
    $.homeAddress.value = e.rowData.result;     
   	tblvAutoComplete.hide();
   	isSearched = true;
});

//Returns the array which contains a match with the pattern
function PatternMatch(arrayToSearch, pattern){
console.log("hie");
    var searchLen = pattern.length;
    arrayToSearch.sort();
    var tempArray = [];
    for(var index = 0, len = arrayToSearch.length; index< len; index++){
        if(arrayToSearch[index].substring(0,searchLen).toUpperCase() === pattern.toUpperCase()){
            tempArray.push(arrayToSearch[index]);
        }
    }
    return tempArray;
}
//setting the tableview values
function CreateAutoCompleteList(searchResults){
    var tableData = [];
    for(var index=0, len = searchResults.length; index < len; index++){

            var lblSearchResult = Ti.UI.createLabel({
                top            : 2,
                width          : '40%',
                height         : 34,
                left           : '5%',
                font           : { fontSize : 14 },
                color          : '#000000',
                text           : searchResults[index]
            });

            //Creating the table view row
            var row = Ti.UI.createTableViewRow({
               backgroundColor : 'transparent',
               focusable       : true,
               height          : 50,
               top 				: 50,
               result          : searchResults[index]
            });

            row.add(lblSearchResult);
            tableData.push(row);
    }
    tblvAutoComplete.setData(tableData);
    tblvAutoComplete.height = tableData.length * 35;
}

