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
/*jslint plusplus: true*/

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
            
            $('#popup-conf-floor').popup('open');
        });
        
        $("#popup-conf-floor #button-image").click(function (event) {
            
            navigator.camera.getPicture(
                function (uri) {
                    var img = $('.thumb-img img'),
                        imgName = $('#popup-conf-floor #curr-img'),
                        imgHideName = $('#popup-conf-floor #url');

                    img.css('display: block; visibility: visible');
                    img.src = uri;
                    imgName.text(uri);
                    imgHideName.val(uri);

                    console.log("IMG " + uri);
                },
                function (e) {
                    console.log("Error getting picture: " + e);
                    document.getElementById('camera_status').innerHTML = "Error getting picture.";
                },
                {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                }
            );
        });
            
        $("#popup-conf-floor #floor-conf-ok").click(function (event) {

            var floor = {};

           
          
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
            
            $('#popup-conf-floor').popup('close');
            
            $('#popup-conf-floor form')[0].reset();
            $('#popup-conf-floor #curr-img').text("");

         
            console.log(JSON.stringify(floor));

            visual.addFloor(floor);
            
             
        });
        
        // cancel button
        $("#popup-conf-floor :button").click(function (event) {
            $('#popup-conf-floor').popup('close');
            $('#popup-conf-floor form')[0].reset();
        });
            
        $("#floor-panel #add-floor").data("entry", { "level": 999 });
    },
    
    addFloor: function (floor) {
        "use strict";
        
        console.log("ADD FLOOR");
        
        var insertDiv = "#add-floor",
            floorCanvas;
        
        if (floor.level === "") {
            floor.level = 0;
        }
   
        $("#floor-panel .floor-canvas").each(function (index) {
            var data = $(this).data("entry");
           // console.log("nivel0: " + "   " +  JSON.stringify(data));
       
            console.log("nivel: " + index);
            if (data) {
                console.log("nivel: " + index + "  " + data.level + "  " + floor.level);
                
                if (data.level > floor.level) {
                    insertDiv = this;
                    return false;       // break
                } else if (data.level == floor.level) { // if level already exits
                    floor.level++;
                }
            }
        });
        
       // floorCanvas = $("<div class='floor-canvas'><img src='" + floor.image + "'/><p>" + floor.name + " (" + floor.level + ")</p></div>").insertBefore(insertDiv);
        
       // visual.getPhoto();
        
        floorCanvas = $("<div class='floor-canvas'><img src='" + floor.url + "'/><p>" + floor.name + " (" + floor.level + ")</p></div>").insertBefore(insertDiv);
        
        
        $(floorCanvas).data("entry", floor);
         
    }
        
    
};
