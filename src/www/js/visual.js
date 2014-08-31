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
    
    /* members */
    floorEdit: -1,
    divEdit: null,
    
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
            
            visual.floorEdit = -1;
            visual.divEdit = null;
            
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
                    imgName.text(uri.split('/').pop());
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
            
            if (visual.floorEdit !== -1) {
                visual.divEdit.remove();
            }
            
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
            floorCanvas,
            h;
        
        if (floor.level === "") {
            floor.level = 0;
        }
   
        //insertDiv = visual.getNextDiv(floor);
        $("#floor-panel .floor-canvas").each(function (index) {
            var data = $(this).data("entry");
       
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
        
        floorCanvas = $("<div class='floor-canvas' id='L" + floor.level + "'><img src='" + floor.url + "'/><p>" + floor.name + " (" + floor.level + ")</p></div>").insertBefore(insertDiv);
        
        $(floorCanvas).data("entry", floor);
        
        h = $(floorCanvas).height() * .18;
        
        $(".floor-canvas p").css({
            'font-size': (h / 2) + 'px',
            'line-height': h + 'px'
        });

        $(floorCanvas).on("taphold",  function (event) {
            console.log("pulsacion larga");
            
            if (visual.floorEdit != $(this).data("entry").level) {
                $(".floor-edit-toolbar").slideToggle("fast");
                $(".floor-edit-toolbar").remove();
                // visual.divEdit = null;
                // visual.floorEdit = -1;
            }
            
            visual.floorEdit = $(this).data("entry").level;
            visual.divEdit = $(this);
            
            var divToolBar = "<div class='floor-edit-toolbar'><div class='ui-grid-c'><div class='ui-block-a button'><p id='left-shift-floor'>&laquo;</p></div><div class='ui-block-b button'><p id='edit-floor'>i</p></div><div class='ui-block-c button'><p id='delete-floor'>X</p></div><div class='ui-block-d button'><p id='right-shift-floor'>&raquo;</p></div></div></div>",
                div = ".floor-canvas#L" + visual.floorEdit;
            
            $(divToolBar).appendTo(div);
            
            console.log("DIV " + div);
            console.log("EF " + visual.floorEdit);
            
            $(".floor-edit-toolbar").slideToggle("fast");
            
           
            /*
            $(floorCanvas).animate({
                bottom: height
            }, "fast");*/
            
            $(".floor-edit-toolbar #delete-floor").click(function () {
                console.log("DELETE FLOOR");
                $('#popup-confirm').popup('open');
                
                $("#popup-confirm #delete").click(function () {
                    visual.divEdit.remove();
                });
            });
            
            $(".floor-edit-toolbar #edit-floor").click(function () {
                console.log("EDIT FLOOR");
                
                $('#popup-conf-floor #level').val(visual.divEdit.data("entry").level);
                $('#popup-conf-floor #name').val(visual.divEdit.data("entry").name);
                $('#popup-conf-floor #descrip').val(visual.divEdit.data("entry").descrip);
                $('#popup-conf-floor #curr-img').text(visual.divEdit.data("entry").url.split('/').pop());
                $('#popup-conf-floor #url').val(visual.divEdit.data("entry").url);
                
                $('#popup-conf-floor').popup('open');
            });
            
            $(".floor-edit-toolbar #left-shift-floor").click(function () {
                console.log("LEFT SHIFT FLOOR");

                var floor = visual.divEdit.data("entry"),
                    floortmp,
                    prevDiv = null;
                 
                if (floor.level > 0) {
                    prevDiv = visual.getFloorCanvasDiv(floor.level - 1);
                    var nd = ".floor-canvas#L" + (floor.level - 1);
                    
                     if (prevDiv !== null) {
                        floortmp = prevDiv.data("entry");
                        floortmp.level++;
                        prevDiv.data("entry",floortmp);
                        prevDiv.find("p").first().text(floortmp.name + " (" + floortmp.level + ")");
                        $(nd).attr('id','L' + floortmp.level );
                     }
                }
                visual.divEdit.remove();
                floor.level--;
                visual.addFloor(floor);
                 
            });
            
            $(".floor-edit-toolbar #right-shift-floor").click(function () {
                console.log("RIGHT SHIFT FLOOR");

                var floor = visual.divEdit.data("entry"),
                    floortmp,
                    nextDiv = null;
                 
                if (floor.level < 999) {
                    nextDiv = visual.getFloorCanvasDiv(floor.level + 1);
                    var nd = ".floor-canvas#L" + (floor.level + 1);
                    
                    if (nextDiv !== null) {
                        floortmp = nextDiv.data("entry");
                        floortmp.level--;
                        nextDiv.data("entry",floortmp);
                        nextDiv.find("p").first().text(floortmp.name + " (" + floortmp.level + ")");
                        $(nd).attr('id','L' + floortmp.level );
                    }
                    visual.divEdit.remove();
                    floor.level++;
                    visual.addFloor(floor);
                }
                 
            });
            
            
        });
        
       
        
       /* $(floorCanvas).click(function (event) {
            console.log("pulsacion corta");
             
            $(".floor-edit-toolbar").slideToggle("fast");
            $(".floor-edit-toolbar").remove();
            
            visual.floorEdit = -1;
            visual.divEdit = null;
    
        });*/
         
    },
    
    getFloorCanvasDiv: function (level) {
        "use strict";
        
        var returnDiv = null;
        
        $("#floor-panel .floor-canvas").each(function (index) {
            var data = $(this).data("entry");
       
            console.log("GFCnivel: " + index);
            if (data) {
                console.log("GFCnivel: " + index + "  " + data.level + "  " + level);
                
                if (data.level == level) {
                    returnDiv = $(this);
                    
                    console.log("ENCONTRADO  " + data.name);
                    return false;
                }
            }
        });
        
        return returnDiv;
    }
    
    
    
    
};
