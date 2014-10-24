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
            filename,
            dirname,
            floors,
            location = this;
        
        dirname = this.name;
        floors = this.floors;
        
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
                var path1 = "VisualDomo/locations", path2 = "VisualDomo/locations/" + dirname;
                
                fileSystem.root.getDirectory(path1, {create: false, exclusive: false},
                    function (dirEntry) {
                        
                        console.log("FLO0  " + JSON.stringify(dirEntry));
                        dirEntry.getDirectory(dirname, {create: true, exclusive: false},
                            function (dirEntry2) {
                                console.log("FLO000  " + JSON.stringify(dirEntry2));
                                console.log("PRUEBAAAAA0000 "+JSON.stringify(floors));
                                
                                
//                                floors.forEach(function (entry) {
//                                    console.log("FLO1  " + JSON.stringify(entry));
//                                    window.resolveLocalFileSystemURL(entry.URL,
//                                        function (fileEntry) {
//                                            console.log("FLO2  " + JSON.stringify(fileEntry));
//                                            console.log("FLO3  " + JSON.stringify(dirEntry));
//                                            fileEntry.copyTo(dirEntry2, fileEntry.name, 
//                                                function(newFileEntry){
//                                                    entry.URL =  newFileEntry.nativeURL;
//                                                    console.log("PRUEBAAAAA "+JSON.stringify(location.floors));
//                                                },
//                                                function(){});
//                                        },
//                                        function () {  
//
//                                        });
//                                });
                                
                                $.when(location.copyFloors(floors, dirEntry2)).done(function() {
                                    
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
                                });
                                    
                            },
                            helpFile.errorHandler);
                        
//                        json = JSON.stringify(location);
//                
//                        dirEntry.getFile(filename, {create: true, exclusive: false},
//                            function (fileEntry) {
//                                fileEntry.createWriter(
//                                    function (writer) {
//                                        writer.write(json);
//                                    },
//                                    helpFile.errorHandler
//                                );
//                            },
//                            helpFile.errorHandler
//                            );
//                        
//                          console.log("planta fin " + json);
                    },
                    helpFile.errorHandler);
                
    
//                var parentEntry = new DirectoryEntry(path1);
//                 console.log("FLO0  " + JSON.stringify(parentEntry));
//                parentEntry.getDirectory(dirname, {create: true, exclusive: false},
//                    function (dirEntry) {
//                         console.log("FLO000  " + JSON.stringify(dirEntry));
//                        floors.forEach(function (entry) {
//                            console.log("FLO1  " + JSON.stringify(entry));
//                            window.resolveLocalFileSystemURL(entry.URL,
//                                function (fileEntry) {
//                                    console.log("FLO2  " + JSON.stringify(fileEntry));
//                                 //   var parentEntry2 = new DirectoryEntry(path2);
//                                    console.log("FLO3  " + JSON.stringify(dirEntry));
//                                    fileEntry.copyTo(dirEntry, "pisa.lo", function(){},function(){});
//                                },
//                                function () {
//
//                                });
//                        });
//                    },
//                    helpFile.errorHandler);
//                
                
                
//                helpFile.createDirectories(fileSystem.root, path2.split('/'),
//                    function () {
//                        // copio las imagenes
//                        
//                        floors.forEach(function (entry) {
//                            console.log("FLO1  " + JSON.stringify(entry));
//                            window.resolveLocalFileSystemURL(entry.URL,
//                                function (fileEntry) {
//                                     console.log("FLO2  " + JSON.stringify(fileEntry));
//                                    var parentEntry = new DirectoryEntry(path2);
//                                     console.log("FLO3  " + JSON.stringify(parentEntry));
//                                    fileEntry.copyTo(parentEntry, "pisa.lo", function(){},function(){});
//                                },
//                                function () {
//                                
//                                });
//                        
                   //     });
                      
                        
                    },
                    function () {   // Not used
                        navigator.app.exitApp();
                    });
                
      //      },
    //        helpFile.errorHandler
    //        );

	};
    
    Location.prototype.copyFloors = function (floors, dirEntry) {
    
        var promises = [];
        
        floors.forEach(function (entry) {

            var def = new $.Deferred();
            console.log("FLO1  " + JSON.stringify(entry));
            window.resolveLocalFileSystemURL(entry.URL,
                function (fileEntry) {
                    console.log("FLO2  " + JSON.stringify(fileEntry));
                    console.log("FLO3  " + JSON.stringify(dirEntry));
                    fileEntry.copyTo(dirEntry, fileEntry.name, 
                        function(newFileEntry){
                            entry.URL =  newFileEntry.nativeURL;
                       //     console.log("PRUEBAAAAA "+JSON.stringify(location.floors));
                            def.resolve();
                        },
                        function(){});
                },
                function () {  
                
            });
            
            promises.push(def);
        });
        
        return $.when.apply(undefined, promises).promise();
    };
    
    Location.prototype.save2 = function () {
        var json = JSON.stringify(this),
            filename,
            dirname,
            floors,
            location = this;
        
        dirname = this.name;
        floors = this.floors;
        
        if (this.BSSIID === "") {
            filename = this.name + ".vdlt";
        } else {
            filename = this.name + ".vdl";
        }
        
        console.log("planta " + json);
        
        this.copyFloors(function (dirEntry) {
        
            json = JSON.stringify(this);
                
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
        
        });
        
        
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