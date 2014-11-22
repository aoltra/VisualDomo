/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          11/10/2014
 *
 * Espacio de nombres selectLocal
 *
 * selectLocal namespace
 */

/* JSLint options */
/*global Connection, $, app, helpFile, helpImage, FileReader, console, LocalFileSystem, Location, Floor, Port, ODControl, visual */
/*jslint plusplus: true*/

var selectLocal = {

    // MEMBERS
    use: 0,             // current use 0: select local, 1: assign local
    currentLocal: null, // local to visualize
    locations: [],
    
    // FUNCTIONS
    // selectLocal Constructor
    initialize: function (callback) {
        "use strict";
    
        selectLocal.locations = [];
        selectLocal.loadLocations(function () {
            $("#page-select-local #local-list .assign-button").css("background", "#cca7bc");
            $("#page-select-local #local-list .assign-button").css("font-weight", "normal");
            $("#page-select-local #local-list .assign-button").css("color", "#283f00");
            
            callback();
        });
        
    },
    
    setUse: function (use) {
        "use strict";
        
        var txtButton, listItems;
        
        selectLocal.use = use;
        
        console.log("USO SELECCION: " + selectLocal.use);
        
        if (selectLocal.use === 0) {
            txtButton = "Seleccionar";
           
            $(".header-select-local").removeClass("header-select-local-link");
            $(".header-select-local").addClass("header-select-local-conf");
        } else {
            txtButton = "Asignar";
           
            $(".header-select-local").removeClass("header-select-local-conf");
            $(".header-select-local").addClass("header-select-local-link");
        }
        
        // change button text
        $("#page-select-local #local-list .assign-button").text(txtButton);
        
        if (selectLocal.use === 1) {
           
            selectLocal.locations.forEach(function (entry) {
                var idButton;
                
                if (entry.assign === true) {
                    idButton = "li#local-" + entry.name;
                    $(idButton + " .assign-button").text("Desasignar");
                }
            });
        }
       
        
        if (selectLocal.use === 0) {
            $(".header-select-local").text("Selecciona la localización a configurar:");
        } else {
            $(".header-select-local").html("Selecciona la localización a asignar a <i>" + app.SSID + "</i>:");
        }
    },
    
    loadLocations: function (callback) {
        "use strict";
           
        var path = 'VisualDomo/locations/';
            
        app.root.getDirectory(path, {},
            // Successful request of directory
            function (dirEntry) {
                
                helpFile.readDirectoryEntries(dirEntry,
                    
                    function (results) {
                
                        var numberLocal = 0, numberLocalRead = 0,
                            collapsible;
                
                        results.forEach(function (value, index) {

                            if (!value.isDirectory) {

                                var ext = value.name.substring(value.name.lastIndexOf('.') + 1, value.name.length),
                                    name = value.name.substring(0, value.name.lastIndexOf('.')),
                                    collapsibleLocal,
                                    tableInfo,
                                    data;

                                if (ext === 'vdlt' || ext === 'vdl') {
                                    
                                    selectLocal.locations[numberLocal] = {"name": name, "assign": false, "BSSID": ""};
                                    numberLocal++;
            
                                    dirEntry.getFile(value.name, null, function (fileEntry) {
                                        
                                        fileEntry.file(function (file) {
                                          //  console.log("FILE " + JSON.stringify(file));
                                            var reader = new FileReader();
                                            
                                            reader.readAsText(file);
                                            reader.onloadend = function (evt) {
                                                //var URL, idButton, BSSID, addClass;
                                             
                                                data = JSON.parse(evt.target.result);
                                                
                                                selectLocal.addLocationToCollapsible(data);
                                                
//                                                if (data.floors.length > 0) {
//                                                    if (data.floors[0].invColor === "on") {
//                                                        addClass = " class='invert-colors' ";
//                                                    } else {
//                                                        addClass = "";
//                                                    }
//                                                    URL =  "<img width='40%' " + addClass + " src='" + data.floors[0].URL + "'/>";
//                                                } else {
//                                                    URL = "";
//                                                }
//                                                
//                                                if (data.BSSID !== "") {
//                                                    BSSID = "<b>" + data.BSSID  + " / " + data.SSID + "</b>";
//                                                    
//                                                    if (app.BSSID === data.BSSID) {
//                                                        selectLocal.currentLocal = data;
//                                                    }
//
//                                                } else {
//                                                    BSSID = "Sin asignar";
//                                                }
//                                                
//                                                tableInfo = "<li class='select-local-item' id='local-" + name + "'><table class='info-table'><tr><td>Nombre:</td><td width='37%'>" +
//                                                    data.name +
//                                                    "</td><td colspan='2' width='35%'>" +
//                                                    "<button class='assign-button' type='button'></button>" +
//                                                    "</td></tr><tr><td>Descripción:</td><td colspan='3'>" +
//                                                    data.description +
//                                                    "</td></tr><tr><td>Estado:</td><td>" +
//                                                    BSSID +
//                                                    "</td><td colspan='2' rowspan='3'>" +
//                                                    URL +
//                                                    "</td></tr><tr><td>Plantas:</td><td>" +
//                                                    data.floors.length +
//                                                    "</td></tr><tr><td>ODC:</td><td>" +
//                                                    data.odcontrols.length +
//                                                    "</td></tr></table></li>";
//                                      
//                                                collapsibleLocal = $(tableInfo);
//                                                
//                                                $('#local-list').append(collapsibleLocal);
//                                          
//                                                idButton = "li#local-" + name;
//                                               // $(idButton + " .assign-button").data("entry", data);
//                                                collapsibleLocal.data("entry", data);
//                                                $(idButton + " .assign-button").click(function () {
//                                                
//                                                    if (selectLocal.use === 0) {
//                                                       
//                                                        $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
//                                                        visual.loadLocation(data);
//                                                
//                                                    } else {
//                                                        
//                                                        // TODO comprobar si ya esta asignada => desasignar
//                                                        // TODO comprobar si ya hay otra localización con ese BSSID
//                                                        var local;
//                                                        
//                                                        local = new Location("", "", "");
//                                                        
//                                                        local.create(data);
//                                                        local.assign(app.BSSID, app.SSID);
//                                                        local.save();
//                                                        helpFile.deleteFile(app.root, path + name + ".vdlt", function () {}, helpFile.errorHandler);
//                                                        $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
//                                                        visual.loadLocation(data);
//                                                        visual.setUse(1);
//                                                    }
//                                                });
                                                
                                                numberLocalRead++;
                                                
                                                if (numberLocalRead === numberLocal) {
                                                    callback();
                                                }
                                            };
                                        }, function () {
                                            console.log("Error!!");
                                        });
                                    }, function () {
                                        console.log("Error getFile");
                                    });
                                
                                }
                            }
                    
                        });
                
                        console.log("NF:" + numberLocal);
                
                        if (numberLocal === 0) {
                            $(".header-select-local").text("No se han encontrado Localizaciones.");
                            callback();
                        }
                           
                    },
                    function (error) {
                    });
            },
            function (error) {
            });
    },
    
    existLocation: function (name) {
        "use strict";
        
        var i;
        
        for (i = 0; i < selectLocal.locations.length; i++) {
            if (selectLocal.locations[i].name === name) {
                return i;
            }
        }
            
        return -1;
    },
    
    addLocation: function (location) {
        "use strict";
        
        var i, tableInfo, addClass, URL, idButton, len;
        
        for (i = 0; i < selectLocal.locations.length; i++) {
            if (selectLocal.locations[i].name === name) {
                return false; // it hasn't to insert
            }
        }
        
        len = selectLocal.locations.length;
        selectLocal.locations[len] = {"name": location.name, "assign": false, "BSSID": ""};
        
        selectLocal.addLocationToCollapsible(location);
        
        $("#page-select-local #local-list .assign-button").css("background", "#cca7bc");
        $("#page-select-local #local-list .assign-button").css("font-weight", "normal");
        $("#page-select-local #local-list .assign-button").css("color", "#283f00");
    },
    
    // add a new location at the end of the collapsible tree
    addLocationToCollapsible: function (location) {
        "use strict";
        
        var tableInfo, addClass, URL, idButton, BSSID,
            path = 'VisualDomo/locations/';
        
        idButton = "li#local-" + location.name;
        
        if (location.floors.length > 0) {
            if (location.floors[0].invColor === "on") {
                addClass = " class='invert-colors' ";
            } else {
                addClass = "";
            }
            URL =  "<img width='40%' " + addClass + " src='" + location.floors[0].URL + "'/>";
        } else {
            URL = "";
        }
        
        if (location.BSSID !== "") {
            BSSID = "<b>" + location.BSSID  + " / " + location.SSID + "</b>";

            if (app.BSSID === location.BSSID) {
                selectLocal.currentLocal = location;
            }
           
            selectLocal.locations[selectLocal.existLocation(location.name)].assign = true;
            selectLocal.locations[selectLocal.existLocation(location.name)].BSSID = location.BSSID;
        } else {
            BSSID = "Sin asignar";
        }
        
        tableInfo = "<li class='select-local-item' id='local-" + location.name +
                "'><table class='info-table'><tr><td>Nombre:</td><td width='37%'>" +
                location.name +
                "</td><td colspan='2' width='35%'>" +
                "<button class='assign-button' type='button'></button>" +
                "</td></tr><tr><td>Descripción:</td><td colspan='3'>" +
                location.description +
                "</td></tr><tr><td>Estado:</td><td class='state'>" +
                BSSID +
                "</td><td colspan='2' rowspan='3'>" +
                URL +
                "</td></tr><tr><td>Plantas:</td><td>" +
                location.floors.length +
                "</td></tr><tr><td>ODC:</td><td>" +
                location.odcontrols.length +
                "</td></tr></table></li>";
        
            
        $('#local-list').append($(tableInfo));
        idButton = "li#local-" + location.name;
        $(tableInfo).data("entry", location);
        
        $('#local-list').trigger("create");
        
        $(idButton + " .assign-button").click(function () {

            if (selectLocal.use === 0) {

                $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
                visual.setUse(0);
                visual.loadLocation(location);

            } else {
                
                // TODO comprobar si ya hay otra localización con ese BSSID
                
                var local, assign = false, i, pos, alreadyExist = false;
                
                for (i = 0; i < selectLocal.locations.length; i++) {
                    if (selectLocal.locations[i].BSSID === app.BSSID) {
                        alreadyExist = true;
                        break;
                    }
                }
                
                
                for (i = 0; i < selectLocal.locations.length; i++) {
                    if (selectLocal.locations[i].name === location.name) {
                        pos = i;
                        if (selectLocal.locations[i].assign === true) {
                            assign = true;
                            break;
                        }
                    }
                }
                
                local = new Location("", "", "");

                local.create(location);
                if (assign === false) {
                    local.assign(app.BSSID, app.SSID);
                } else { // dissociate
                    local.dissociate();
                }
                
                if (assign === false && alreadyExist === true) {
                    app.alert("Está wifi (" + app.SSID + ") ya está asiganda a una localización", true, 0);

                    window.setTimeout(function () {
                        app.alert("", false);
                    }, 1350);
                    return;
                }
                
                local.save();
                if (assign === false) {  // assign
                    $(this).text("Desasignar");
                    selectLocal.locations[pos].assign = true;
                    selectLocal.locations[pos].BSSID = local.BSSID;
                    BSSID = "<b>" + local.BSSID  + " / " + local.SSID + "</b>";
                    $('li#local-' + location.name + ' .state').html(BSSID);
                    helpFile.deleteFile(app.root, path + location.name + ".vdlt", function () {}, helpFile.errorHandler);
                    $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
                    visual.loadLocation(location);
                    visual.setUse(1);
                } else {  // dissociate
                    helpFile.deleteFile(app.root, path + location.name + ".vdl", function () {}, helpFile.errorHandler);
                    $(this).text("Asignar");
                    selectLocal.locations[pos].assign = false;
                    selectLocal.locations[pos].BSSID = "";
                    $('li#local-' + location.name + ' .state').html("Sin asignar");
                }
                
                $('#local-list').trigger("create");
            }
        });

        return true;
    
    }
};
    