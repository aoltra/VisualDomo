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
/*global Connection, $, app, helpFile, helpImage, console, LocalFileSystem, Location, Floor, Port, ODControl */
/*jslint plusplus: true*/

var selectLocal = {

    // selectLocal Constructor
    initialize: function () {
        "use strict";
    
        selectLocal.loadLocations();
    },
    
    loadLocations: function () {
        "use strict";
           
        var path = 'VisualDomo/locations';
        
        app.root.getDirectory(path, {},
            // Successful request of directory
            function (dirEntry) {
                helpFile.readDirectoryEntries(dirEntry,
                    function (results) {
                
                        var numberLocal = 0,
                            collapsible;
                
                        results.forEach(function (value, index) {

                            if (!value.isDirectory) {

                                var ext = value.name.substring(value.name.lastIndexOf('.') + 1, value.name.length),
                                    name = value.name.substring(0, value.name.lastIndexOf('.')),
                                    collapsibleLocal,
                                    header,
                                    tableInfo,
                                    data;

                                if (ext === 'vdlt' || ext === 'vdl') {
                                    
                                    numberLocal++;
                                    
                                    collapsible = $("<div data-role='collapsible' data-inset='false' class='collapsible-local' id='local-" +
                                                    name + "'></div>");
                                    $("#page-select-local #local-list").append(collapsible);
        
                                    header = $("<h1>" + name + "</h1>");
                                    $(collapsible).append(header);
                                    
                                    $(collapsible).on("taphold", function (event) {
                      
                                        $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
                                      
                                        visual.loadLocation(data);
                                    });
                                     
                                    dirEntry.getFile(value.name, null, function (fileEntry) {
                                        
                                        fileEntry.file(function (file) {
                                          //  console.log("FILE " + JSON.stringify(file));
                                            var reader = new FileReader();
                                            reader.readAsText(file);
                                            reader.onloadend = function (evt) {
                        
                                                data = JSON.parse(evt.target.result);
                                           //     console.log("data " + data0);
                                                tableInfo = "<p><table class='info-table'><tr><td>Nombre:</td><td colspan='3'>" +
                                                    data.name +
                                                    "</td></tr><tr><td>Descripción:</td><td colspan='3'>" +
                                                    data.description +
                                                    "</td></tr><tr><td>Estado:</td><td>Sin asignar</td><td colspan='2' rowspan='3'></td></tr><tr><td>Plantas:</td><td>" +
                                                    data.floors.length +
                                                    "</td></tr><tr><td>ODC:</td><td>" +
                                                    data.odcontrols.length +
                                                    "</td></tr></table></p>";
                                                
                                                collapsibleLocal = $(tableInfo);
                                                collapsibleLocal.insertAfter(header);
                                            };
                                        },
                                        function () {
                                            console.log("Error!!");
                                        })
                                    },
                                    function () {
                                        console.log("Error getFile");
                                    });
                                    
                                   
                                }
                            }
                    
                        });
                
                        console.log("NF:" + numberLocal);
                
                        if (numberLocal === 0) {
                            $(".header-select-local").text("No se han encontrado Localizaciones.");
                        } else {
                            $(".header-select-local").text("Selecciona la localización a configurar:");
                         //   $(collapsible).collapsible();
                        }
                    },
                    function (error) {
                    });
            },
            function (error) {
            });
    }
};
    