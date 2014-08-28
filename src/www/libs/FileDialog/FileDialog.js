/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          20/8/2014
 *
 * Página de carga de ficheros
 *
 * File chooser dialog
 */

/* JSLint options */
/*global $, console, helpURL, helpFile, LocalFileSystem, alert, visual */
/*jslint plusplus: true*/

var fileDialog = {

    rootFolder: null,
    currFolder: null,
    currFile: null,
    
    // Initilize dialog
    initialize: function (config) {
        "use strict";
        
        var json_config,
            screen = $.mobile.getScreenHeight() * 0.9,
            header = $("#file-dialog .ui-header").hasClass("#file-dialog ui-header-fixed") ? $("#file-dialog .ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight(),
            footer = $("#file-dialog .ui-footer").hasClass("#file-dialog ui-footer-fixed") ? $("#file-dialog .ui-footer").outerHeight() - 1 : $("#file-dialog .ui-footer").outerHeight(),
            contentCurrent = $("#file-dialog .ui-content").outerHeight() - $("#file-dialog .ui-content").height(),
            content = screen - header - footer - contentCurrent;

        $("#file-dialog .ui-content").height(content - 42);
        console.log("connn :" + config);
        
        json_config = helpURL.getParameterByName(config);
        $("#file-dialog #header-title").text(json_config.title);
        
        if (json_config.initialFolder === 'undefined') {
       
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function (fileSystem) {
                    fileDialog.displayEntries(fileSystem.root);
                    fileDialog.rootFolder = fileSystem.root;
                },
                helpFile.errorHandler
                );
            
        } else {
    
          //  fileDialog.currFolder = json_config.initialFolder;
    
        }
            
        $("#button-home").click(function () {
            fileDialog.displayEntries(fileDialog.rootFolder);
        });
        
        $("#button-back").click(function () {
            fileDialog.backFolder(fileDialog.currFolder);
        });
        
        $("#button-close").click(function () {
            $.mobile.pageContainer.pagecontainer("back");
        });
        
        $("#popup-conf-floor :submit").click(function (event) {
                 
            var floor = {};
            
            $('#popup-conf-floor').popup('close');
           
            
            $.each($('#popup-conf-floor form').serializeArray(), function () {
            
                if (floor[this.name]) {
                    if (!floor[this.name].push) {
                        floor[this.name] = [floor[this.name]];
                    }
                    floor[this.name].push(this.value || '');
                } else {
                    floor[this.name] = this.value || '';
                }
            });
            
            floor.URL = fileDialog.currFolder.fullPath + "/" + fileDialog.currFile;
            console.log(JSON.stringify(floor));
            
            visual.addFloor(floor);
        });
        
        // cancel button
        $("#popup-conf-floor :button").click(function (event) {
            $('#popup-conf-floor').popup('close');
            $('#popup-conf-floor form')[0].reset();
        });
    },
    
    displayEntries: function (directory) {
        "use strict";
    
        if (directory === null) {
            return;
        }
        
        $("#curr-folder").text(directory.fullPath);
        fileDialog.currFolder = directory;
    
        helpFile.readDirectoryEntries(directory,
            function (results) {
                
                var numberDir = 0,
                    numberFiles = 0,
                    row;
                
                $(".table-fd#folder").empty();
                $(".table-fd#files").empty();
                
                fileDialog.currFile = null;
                                               
                results.forEach(function (value, index) {
                    
                    if (value.isDirectory) {
                      
                        numberDir++;
                        row = $("<div class='table-row-fd'><div class='table-cell'><span class='icon-fd'>s</span>" + value.name + "</span></div></div>").appendTo(".table-fd#folder");
                        
                        $(row).data("entry", value);
                        $(row).click(function (event) {
                            var newFolder = $(this).data("entry");
                            fileDialog.displayEntries(newFolder);
                        });
                        
                    } else {
                    
                        var ext = value.name.substring(value.name.lastIndexOf('.') + 1, value.name.length);
                        
                        if (ext === 'png' || ext === 'PNG') {
                            numberFiles++;
                        
                            row = $("<div class='table-row-fd'><div class='table-cell'><span class='icon-fd'>p</span>" + value.name + "</span></div></div>").appendTo(".table-fd#files");
                            
                            fileDialog.currFile = value.name;
                            $(row).click(function (event) {
                               
                                $('#popup-conf-floor').popup('open');
                            });
                        }
                    }
                    
                });
                
                console.log("NF:" + numberFiles + "  ND:" + numberDir);
                
                if (numberFiles === 0) {
                    row = "<div class='no-floors'>No hay plantas en este directorio</div>";
                    $(row).appendTo(".table-fd#files");
                }
            },
            function (error) {
            });
    },
    
    backFolder: function (directory) {
        "use strict";
    
        if (directory === null) {
            return;
        }
        
        directory.getParent(function (parentFolder) {
            if (parentFolder.fullPath === directory.fullPath) {
                fileDialog.displayEntries(fileDialog.rootFolder);
            } else {
                fileDialog.displayEntries(parentFolder);
            }
        }, function (error) {
            alert("Error al obtener el directorio padre");
        });
    }
};

			
		