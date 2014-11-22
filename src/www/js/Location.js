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
/*global helpFile, $, LocalFileSystem, app, console, Floor, ODControl, Port */

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
        
        app.alert("Grabando...", true);
        
        dirname = this.name;
        floors = this.floors;
        
        if (this.BSSID === "") {
            filename = this.name + ".vdlt";
        } else {
            filename = this.name + ".vdl";
        }
        
  //      console.log("planta " + json);
        
        // Create VisualDomo directories
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
     
            // Successful request of a file system
            function (fileSystem) {
                var path1 = "VisualDomo/locations/"; //, path2 = "VisualDomo/locations/" + dirname;
                
                fileSystem.root.getDirectory(path1, {create: false, exclusive: false},
                    function (dirEntry) {
                        
                        console.log("FLO0  " + JSON.stringify(dirEntry));
                        dirEntry.getDirectory(dirname, {create: true, exclusive: false},
                            function (dirEntry2) {
                                console.log("FLO000  " + JSON.stringify(dirEntry2));
                                console.log("PRUEBAAAAA0000 " + JSON.stringify(floors));
                                
                                
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

                                    console.log("planta fin " + json);
                                    
                                    app.alert("Grabación finalizada", true, null);
                                    
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
                    console.log("sadsdad " + JSON.stringify(fileEntry));
                
                    fileEntry.copyTo(dirEntry, fileEntry.name,
                        function (newFileEntry) {
                            entry.URL =  newFileEntry.nativeURL;
                      
                            def.resolve();
                            
                        }, function () { // Probably file is in locations folder already
                            console.log("Ya hay un fichero con ese nombre");
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
            odc = new ODControl("", entry.name, "", entry.IP, entry.user, entry.password);
            
            ports = odc.ports;
            
            entry.ports.forEach(function (entry) {
                port = new Port("", "", "", "");
                
                port.create(entry);
                
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

}