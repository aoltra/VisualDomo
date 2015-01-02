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
 * Start date:          5/9/2014
 *
 * Encapsula location
 *
 * location encapsulation.
 */

/* JSLint options */
/*global helpFile, $, LocalFileSystem, app, console, Floor, ODControl, Port, Translation*/

// Constructor
function Location(BSSID, name, description) {
    "use strict";
    
    this.version = 1;
    
	// description
	this.name = name;							// name 
	this.description = description;			    // description (should include location)
	this.BSSID = BSSID;						    // Identifier wlan
    this.SSID = "";                             // Identifier wlan
    
    // floors
    this.floors = [];
    
    // odccontrol
    this.odcontrols = [];

	// save the location configuration 
	Location.prototype.save = function () {
		var json, // = JSON.stringify(this),
            filename,
            dirname,
            floors,
            location = this;
        
        app.alert(Translation[app.lang].message_0033, true);
        
        dirname = this.name;
        floors = this.floors;
        
        if (this.BSSID === "") {
            filename = this.name + ".vdlt";
        } else {
            filename = this.name + ".vdl";
        }
  
        // Create VisualDomo directories
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
     
            // Successful request of a file system
            function (fileSystem) {
                var path1 = "VisualDomo/locations/"; //, path2 = "VisualDomo/locations/" + dirname;
                
                fileSystem.root.getDirectory(path1, {create: false, exclusive: false},
                    function (dirEntry) {
                
                        dirEntry.getDirectory(dirname, {create: true, exclusive: false},
                            function (dirEntry2) {
                                
                                $.when(location.copyFloors(floors, dirEntry2)).done(function () {
                                    
                                    json = JSON.stringify(location);
               
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

                                    app.alert(Translation[app.lang].message_0034, true, null);
                                    
                                    window.setTimeout(function () {
                                        app.alert("", false);
                                    }, 1250);
                                    
                                });
                                    
                            },
                            helpFile.errorHandler);
                    },
                    helpFile.errorHandler);
             
            }, function () {   // Not used
                navigator.app.exitApp();
            });
	};
    
    Location.prototype.copyFloors = function (floors, dirEntry) {
    
        var promises = [];
        
        floors.forEach(function (entry) {

            var def = new $.Deferred();

            window.resolveLocalFileSystemURL(entry.URL,
                function (fileEntry) {
            
                    fileEntry.copyTo(dirEntry, fileEntry.name,
                        function (newFileEntry) {
                            entry.URL =  newFileEntry.nativeURL;
                      
                            def.resolve();
                            
                        }, function () { // Probably file is in locations folder already
                            console.log("There is already a file with this name");
                            def.resolve();
                        });
                }, function () {
                });
            
            promises.push(def);
        });
        
        return $.when.apply(undefined, promises).promise();
    };
    
    Location.prototype.create = function (data) {
    
        var odc, floor, flrs, odcs, port, ports;
        
        this.name = data.name;
        this.description = data.description;
        this.BSSID = data.BSSID;
        
        odcs = this.odcontrols;
        flrs = this.floors;
        
        data.odcontrols.forEach(function (entry) {
            odc = new ODControl(entry.ID, entry.name, "", entry.IP, entry.user, entry.password);
            
            ports = odc.ports;
            
            entry.ports.forEach(function (entry2) {
                port = new Port("", "", "", "");
                
                port.create(entry2);
                
                ports.push(port);
                
            });
            odcs.push(odc);
        });
        
    
        data.floors.forEach(function (entry) {
            floor = new Floor(entry.level, entry.name,
                              entry.descrip, entry.URL,
                              entry.invColor);

            flrs.push(floor);
        });
    
    };
    
    Location.prototype.addFloor = function (floor) {
        this.floors.push(floor);
	};
    
    Location.prototype.cleanFloors = function () {
        this.floors = [];
	};
    
    Location.prototype.assign = function (BSSID, SSID) {
        this.BSSID = BSSID;
        this.SSID = SSID;
	};
    
    Location.prototype.dissociate = function () {
        this.BSSID = "";
        this.SSID = "";
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
    
    Location.prototype.nextODCID = function () {
        var max = 0;
        
        this.odcontrols.forEach(function (entry) {
            
            if (entry.ID > max) {
                max = entry.ID;
            }
        });
        
        return max + 1;
    };
    
    Location.prototype.removeODC = function (id) {
        var i;
        
        for (i = 0; i < this.odcontrols.length; i = i + 1) {
            
            if (this.odcontrols[i].ID === id) {
                this.odcontrols.splice(i, 1);
                break;
            }
        }
       
    };
    
    
}