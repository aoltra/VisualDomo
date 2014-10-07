/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          5/9/2014
 *
 * Encapsula location
 *
 * location encapsulation.
 */

/* JSLint options */
/*global helpFile,  LocalFileSystem */

// Constructor
function Location(BSSID, name, description) {
    "use strict";
    
	// description
	this.name = name;							// name 
	this.description = description;				// description (should include location)
	this.BSSIID = BSSID;						// Identifier wlan
    
    // floors
    this.floors = [];
    
    // odccontrol
    this.odcontrols = [];

	// save the location configuration 
	Location.prototype.save = function () {
		var json = JSON.stringify(this),
            filename;
        
        if (this.BSSIID === "") {
            filename = this.name + ".vdlt";
        } else {
            filename = this.name + ".vdl";
        }
        
        console.log("planta " + json);
        
        // Create VisualDomo directories
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
     
            // Successful request of a file system
            function (fileSystem) {
                var path = "VisualDomo/locations";
                
                fileSystem.root.getDirectory(path, {create: false, exclusive: false},
                    function (dirEntry) {
                        dirEntry.getFile(filename, {create: true, exclusive: false},
                            function (fileEntry) {
                                fileEntry.createWriter(
                                    function (writer) {
                                        writer.write(json);
                                    },
                                    helpFile.errorHandler
                                );
                            },
                            helpFile.errorHandler
                            );
                    },
                    helpFile.errorHandler);
            },
            helpFile.errorHandler
            );

	};
    
    Location.prototype.addFloor = function (floor) {
        this.floors.push(floor);
	};
    
    Location.prototype.cleanFloors = function () {
        this.floors = [];
	};
    
    Location.prototype.assign = function (BSSID) {
        this.BSSIID = BSSID;
	};
    
    Location.prototype.dissociate = function () {
        this.BSSIID = "";
	};
    
    Location.prototype.addODControl = function (odcontrol) {
        this.odcontrols.push(odcontrol);
	};
    
    Location.prototype.cleanODControls = function () {
        this.odcontrols = [];
	};
    
    Location.prototype.numberODC = function () {
        return this.odcontrols.length;
    };

}