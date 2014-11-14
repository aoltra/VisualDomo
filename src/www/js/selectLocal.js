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
    
    // FUNCTIONS
    // selectLocal Constructor
    initialize: function (callback) {
        "use strict";
    
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
                                    
                                    numberLocal++;
            
                                    dirEntry.getFile(value.name, null, function (fileEntry) {
                                        
                                        fileEntry.file(function (file) {
                                          //  console.log("FILE " + JSON.stringify(file));
                                            var reader = new FileReader();
                                            
                                            reader.readAsText(file);
                                            reader.onloadend = function (evt) {
                                                var URL, idButton, BSSID, addClass;
                                             
                                                data = JSON.parse(evt.target.result);
                                                
                                                if (data.floors.length > 0) {
                                                    if (data.floors[0].invColor === "on") {
                                                        addClass = " class='invert-colors' ";
                                                    } else {
                                                        addClass = "";
                                                    }
                                                    URL =  "<img width='40%' " + addClass + " src='" + data.floors[0].URL + "'/>";
                                                } else {
                                                    URL = "";
                                                }
                                                
                                                console.log("BSSID  s  " + app.BSSID);
                                                
                                                if (data.BSSID !== "") {
                                                    BSSID = "<b>" + data.BSSID  + " / " + data.SSID + "</b>";
                                                    
                                                    if (app.BSSID === data.BSSID) {
                                                        selectLocal.currentLocal = data;
                                                    }

                                                } else {
                                                    BSSID = "Sin asignar";
                                                }
                                                
                                                tableInfo = "<li class='select-local-item' id='local-" + name + "'><table class='info-table'><tr><td>Nombre:</td><td width='37%'>" +
                                                    data.name +
                                                    "</td><td colspan='2' width='35%'>" +
                                                    "<button class='assign-button' type='button'></button>" +
                                                    "</td></tr><tr><td>Descripción:</td><td colspan='3'>" +
                                                    data.description +
                                                    "</td></tr><tr><td>Estado:</td><td>" +
                                                    BSSID +
                                                    "</td><td colspan='2' rowspan='3'>" +
                                                    URL +
                                                    "</td></tr><tr><td>Plantas:</td><td>" +
                                                    data.floors.length +
                                                    "</td></tr><tr><td>ODC:</td><td>" +
                                                    data.odcontrols.length +
                                                    "</td></tr></table></li>";
                                      
                                                collapsibleLocal = $(tableInfo);
                                                
                                                $('#local-list').append(collapsibleLocal);
                                          
                                                idButton = "li#local-" + name;
                                               // $(idButton + " .assign-button").data("entry", data);
                                                collapsibleLocal.data("entry", data);
                                                $(idButton + " .assign-button").click(function () {
                                                
                                                    if (selectLocal.use === 0) {      
                                                       
                                                        $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
                                                        visual.loadLocation(data);     
                                                
                                                    } else {
                                                        
                                                        // TODO comprobar si ya esta asignada => desasignar
                                                        // TODO comprobar si ya hay otra localización con ese BSSID
                                                        var local;
                                                        
                                                        local = new Location("", "", "");
                                                        
                                                        local.create(data);
                                                        local.assign(app.BSSID, app.SSID);
                                                        local.save();
                                                        helpFile.deleteFile(app.root, path + name + ".vdlt", function () {}, helpFile.errorHandler);
                                                        $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
                                                        visual.loadLocation(data);
                                                        visual.setUse(1);
                                                    }
                                                });
                                                
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
    }
};
    