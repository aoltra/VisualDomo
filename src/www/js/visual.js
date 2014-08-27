/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          28/7/2014
 *
 * Espacio de nombres visual
 *
 * visual namespace
 */

/* JSLint options */
/*global Connection, $, helpFile, wifiinfo, console, LocalFileSystem */

var visual = {
    // Visual Constructor
    initialize: function () {
        "use strict";
        
        $("#button-open-floor-panel").click(function () {
            var height;
            
            if ($('#floor-panel').css('display') === 'block') {
                height = '-=' + $('#floor-panel').height();
            } else {
                height = '+=' + $('#floor-panel').height();
            }
            $("#floor-panel").slideToggle("fast");
            
            $("#button-open-floor-panel").animate({
                bottom: height
            }, "fast");
    
        });
        
        $("#add-floor").click(function () {
            console.log("pulsando +");
            
            var fileDialogParams = {
                initialFolder: 'undefined',
                title: 'Selecciona planta'
            };
            
            $.mobile.changePage('libs/FileDialog/main.html', {
                transition: "flip",
                data : fileDialogParams,
                reloadPage : false,
                changeHash : true
            });
        });
        
        $("#floor-panel #add-floor").data("entro", { "level": 999 });
    },
    
    addFloor: function (floor) {
        "use strict";
        
        var insertDiv = "#add-floor",
            floorCanvas;
        
      //   console.log("floor: " + JSON.stringify(floor) );
        
        $("#floor-panel .floor-canvas").each(function (index) {
            var data = $(this).data("entro");
            console.log("nivel0: " + "   " +  JSON.stringify(data));
        //    console.log("nivel1: " + data);
            console.log("nivel: " + index);
            if (data) {
                console.log("nivel: " + index + "  " + data.level + "  " + floor.level);
                
                if (data.level > floor.level) {
                    console.log("entro");
                    insertDiv = this;
                    return false;       // break
                }
            }
        });
        
        floorCanvas = $("<div class='floor-canvas'><img src='" + floor.URL + "'/><p>" + floor.name + " (" + floor.level + ")</p></div>").insertBefore(insertDiv);
      
         console.log("floor: " + JSON.stringify(floor) );
   
        $(floorCanvas).data("entro", floor );
      console.log("data return : " + $(floorCanvas).data("entro"));
    }
    
};
