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

    // MEMBERS
    use: 0,             // current use 0: select local, 1: assign local
    
    // FUNCTIONS
    // selectLocal Constructor
    initialize: function () {
        "use strict";
        
      //  $("#page-select-local #content-select").append("<div data-role='collapsible-set' id='local-list'></div>");
         //$("#local-list").listview().trigger("create");
        selectLocal.loadLocations();
       //  $('#local-list').collapsibleset().trigger('create');
    },
    
    setUse: function (use) {
        "use strict";
        
        var txtButton, listItems;
        
        selectLocal.use = use;
        
        if (selectLocal.use === 0) {
            txtButton = "Seleccionar";
        } else {
            txtButton = "Asignar";
        }     
        
        // change button text
        listItems = $("#local-list li");
        listItems.each(function(idx, li) {
            var local = $(li);
            
          //  if (selectLocal.use === 0) {
        //    $("#local-list li .assign-button").css("display", "none", "important");
       //     local.find(".select-button-button").show();
          //  } else {
            //local.find(".assign-button").show();
            //     $("#local-list li .select-button").css("display", "none", "important");
           // local.find(".select-button-button").css("display", "none");
            //} 
        
          //  if (selectLocal.use === 0) {
            local.find(".assign-button").prop("value", txtButton);
            
            local.find(".assign-button").text(txtButton);
  console.log("mirindoa " + txtButton  + " " + local.find(".assign-button").attr('value'));
        //}
          //  local.find(".assign-button").
            /// and the rest of your code
        });
        
  //      $("#local-list").listview().trigger("create");
        
         if (selectLocal.use === 0) {
            $(".header-select-local").text("Selecciona la localización a configurar:");
        } else {
            $(".header-select-local").html("Selecciona la localización a asignar a <i>"+ app.SSID +"</i>:");
        }
             
        
  //      $("#local-list").listview( "refresh" );
        
        
        console.log("mirindoa " + selectLocal.use);
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
                                    
//                                    collapsible = $("<div data-role='collapsible' data-inset='false' class='collapsible-local' id='local-" +
//                                                    name + "'></div>");
                                    
                             
                                 //   $("#page-select-local #local-list").append(collapsible);
                                  
        
                                  //  header = $("<h1>" + name + "</h1>");
                                //    $(collapsible).append(header);
                                    
                                    $(collapsible).on("taphold", function (event) {
                      
                                    //    $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
                                      
                                    //    visual.loadLocation(data);
                                    });
                                     
                                    dirEntry.getFile(value.name, null, function (fileEntry) {
                                        
                                        fileEntry.file(function (file) {
                                          //  console.log("FILE " + JSON.stringify(file));
                                            var reader = new FileReader();
                                            
                                            reader.readAsText(file);
                                            reader.onloadend = function (evt) {
                                                var URL;
                                             
                                                data = JSON.parse(evt.target.result);
                                                
                                                if (data.floors.length > 0) {
                                                    URL =  "<img width='40%' src='" + data.floors[0].URL + "'/>";
                                                } else {
                                                    URL = "";
                                                }
                                                
                                           //     console.log("data " + data0);
                                                tableInfo = "<li id='local-" + name + "'><table class='info-table'><tr><td>Nombre:</td><td width='20%'>" +
                                                    data.name +
                                                    "</td><td colspan='2' width='40%'>" +
                                            //      "<input class='assign-button' type='button' data-corners=\"true\" value='a'></input>" +
                                                    "<button class='assign-button' type='button'></button>" +
                                                    "</td></tr><tr><td>Descripción:</td><td colspan='3'>" +
                                                    data.description +
                                                    "</td></tr><tr><td>Estado:</td><td>" +
                                                    "Sin a" +
                                                    "</td><td colspan='2' rowspan='3'>" +
                                                    URL +
                                                    "</td></tr><tr><td>Plantas:</td><td>" +
                                                    data.floors.length +
                                                    "</td></tr><tr><td>ODC:</td><td>" +
                                                    data.odcontrols.length +
                                                    "</td></tr></table></li>";
                                      
                                                collapsibleLocal = $(tableInfo);
                                                
                                                $('#local-list').append(collapsibleLocal);
                                          
                                                var idButton = "li#local-" + name;
                                                
                                                 console.log("lcava  " + idButton);
                                                $(idButton + " .assign-button").data("entry", data);
                                                $(idButton + " .assign-button").click(function () {
                                                    
                                                    console.log("paso por " +$(this).data("entry").name);
                                                    if (selectLocal.use === 0) {
                                                        $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
                                                        visual.loadLocation(data);
                                                    } else {
                                                        $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
                                                    }
                                                });
                                            };
                                        },
                                        function () {
                                            console.log("Error!!");
                                        });
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
                        } 
                            
                    },
                    function (error) {
                    });
            },
            function (error) {
            });
    }
};
    