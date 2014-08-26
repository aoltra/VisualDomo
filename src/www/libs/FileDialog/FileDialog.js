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
/*global $, console, helpURL, helpFile, LocalFileSystem, alert */
/*jslint plusplus: true*/

var fileDialog = {

    rootFolder: null,
    currFolder: null,
    
    // Initilize dialog
    initialize: function (config) {
        "use strict";
        
        var json_config,
            screen = $.mobile.getScreenHeight(),
            header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();

        var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();

/* content div has padding of 1em = 16px (32px top+bottom). This step
   can be skipped by subtracting 32px from content var directly. */
        var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();

        var content = screen - header - footer - contentCurrent - 32;

        $(".ui-content").height(content - 10);
        console.log("connn :" + content);
        
        json_config = helpURL.getParameterByName(config);
        $("#header-title").text(json_config.title);
        
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
                                               
                results.forEach(function (value, index) {
                    
                    if (value.isDirectory) {
                      
                        numberDir++;
                        row = $("<div class='table-row-fd'><div class='table-cell'><span class='icon-fd'>s</span>" + value.name + "</span></div></div>").appendTo(".table-fd#folder");
                        
                        $(row).data("entry", value);
                        $(row).click(function (event) {
                            var newFolder = $(this).data("entry");
                            fileDialog.displayEntries(newFolder);
                        });
                                     
                                    /* else if (file_Browser_params.on_file_select != null)
                        {
						var ret = file_Browser_params.on_file_select(entryData);
						if (ret == false) {
							$('.ui-dialog').dialog('close');
							return;
						}*/
					
				
                        
                    } else {
                    
                        var ext = value.name.substring(value.name.lastIndexOf('.') + 1, value.name.length);
                        
                        if (ext === 'png' || ext === 'PNG') {
                            numberFiles++;
                        
                            row = $("<div class='table-row-fd'><div class='table-cell'><span class='icon-fd'>p</span>" + value.name + "</span></div></div>").appendTo(".table-fd#files");
                            
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

			
		