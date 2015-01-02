/* 
 *    This file is part of VisualDomo.

 *    VisualDomo is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.

 *    VisualDomo is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with VisualDomo.  If not, see <http://www.gnu.org/licenses/>.
 */

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

    // ports
    this.ports = [];

	// features
	this.version = "";
    
    ODControl.prototype.getVersion =  function () {
		this.version = app.httpGetRequestToODControl(IP + "/ver", false, user, pass, null);
	};

	// save the ODControl configuration 
	ODControl.prototype.save = function (datos) {
		

	};
    
    ODControl.prototype.readPorts = function () {
        return app.httpGetRequestToODControl(IP + "/lsc", false, user, pass, null);
    };
    
    ODControl.prototype.addPort = function (port) {
        this.ports.push(port);
	};
    
    ODControl.prototype.setPort = function (port) {
        var command, value;
        
        if (port.type === 'A') {
            value = port.value * 10000;
        } else {
            value = port.value;
        }
        
        command = "/set+" + port.name + "+" + value;
    
        return app.httpGetRequestToODControl(IP + command, false, user, pass, null);
    };
}