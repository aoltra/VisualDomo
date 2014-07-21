/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          4/7/2014
 *
 * Encapsula la funcionalidad de los ODControl.
 *
 * ODControl encapsulation.
 */

/* JSLint options */
/*global app */

// Constructor
function ODControl(ID, name, description, IP, user, pass) {
	"use strict";
    
	// access
	this.IP = IP;								// Local IP
	this.user = user;							// user
	this.password = pass;						// password
	
	// description
	this.name = name;							// name 
	this.description = description;				// description (should include location)
	this.ID = ID;								// Identifier


	// features
	this.version = this.version || (function () {
		var ver = app.httpGetRequestToODControl(IP + "/ver", false, "user", "opendomo", null);
        return ver;
	}());

	// save the ODControl configuration 
	ODControl.prototype.save = function (datos) {
		

	};
}