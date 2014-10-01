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
/*global Connection, $, helpFile, helpImage, wifiinfo, console, LocalFileSystem, Location, Floor */
/*jslint plusplus: true*/

var visual = {
    
    /* members */
    floorEdit: -1,
    divEdit: null,
    local: null,
    save: false,
    saved: false,
    
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
            
            $(".floor-edit-toolbar").slideToggle("fast");
            $(".floor-edit-toolbar").remove();
            $(".floor-canvas#L" + visual.floorEdit).removeClass("floor-edit-frame");
            
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
        
        $("#page-visual #config-menu #save").click(function (event) {
        
            $("#config-menu").popup('close');
            
            if (visual.local.name === "") {
                
                visual.save = true;
                // Open a popup from other popup
                $('#config-menu').on({
                    popupafterclose: function () {
                        if (visual.save === true) {
                            setTimeout(function () {
                                $('#popup-conf-location').popup('open');
                            }, 100);
                        }
                    }
                });
            } else {
         
                visual.saveLocation();
            }
            
        });
        
        $("#popup-conf-location #local-conf-ok").click(function (event) {

            var localData = {};
            
            $.each($('#popup-conf-location form').serializeArray(), function () {
                if (localData[this.name]) {
                    if (!localData[this.name].push) {
                        localData[this.name] = [localData[this.name]];
                    }
                    localData[this.name].push(this.value || '');
                } else {
                    localData[this.name] = this.value || '';
                }
            });
            
            $('#popup-conf-location').popup('close');
            $('#popup-conf-location form')[0].reset();
            
            if (localData.name === "") {
                return false;
            } else {
            
                visual.local.name = localData.name;
                visual.local.description = localData.descripcion;

                if (visual.save === true) {
                    visual.saveLocation();
                    visual.save = false;
                }
            }

        });
     
        visual.local = new Location("", "", "");
        
        //BETA
        var json_config,
            screen = $.mobile.getScreenHeight(),
            header = $("#page-visual .ui-header").hasClass("#page-visual ui-header-fixed") ? $("#page-visual .ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight(),
            footer = $("#page-visual .ui-footer").hasClass("#page-visual ui-footer-fixed") ? $("#page-visual .ui-footer").outerHeight() - 1 : $("#page-visual .ui-footer").outerHeight(),
            contentCurrent = $("#page-visual .ui-content").outerHeight() - $("#page-visual .ui-content").height(),
            content = screen - header - footer;// - contentCurrent;

        $("#page-visual .ui-content").height(content);
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
        
        if (floor.invColor === "on") {
            $(".floor-canvas#L" + floor.level + " img").addClass("invert-colors");
        }
        
        h = $(floorCanvas).height() * 0.18;
        
        $(".floor-canvas p").css({
            'font-size': (h / 2) + 'px',
            'line-height': h + 'px'
        });

        $(floorCanvas).on("taphold",  function (event) {
            console.log("pulsacion larga");
            
            if (visual.floorEdit !== $(this).data("entry").level) {
                $(".floor-edit-toolbar").slideToggle("fast");
                $(".floor-edit-toolbar").remove();
                $(".floor-canvas#L" + visual.floorEdit).removeClass("floor-edit-frame");
                // visual.divEdit = null;
                // visual.floorEdit = -1;
            }
            
            visual.floorEdit = $(this).data("entry").level;
            visual.divEdit = $(this);
            
            var divToolBar = "<div class='floor-edit-toolbar'><div class='ui-grid-c'><div class='ui-block-a button'><p id='left-shift-floor'>&laquo;</p></div><div class='ui-block-b button'><p id='edit-floor'>i</p></div><div class='ui-block-c button'><p id='delete-floor'>X</p></div><div class='ui-block-d button'><p id='right-shift-floor'>&raquo;</p></div></div></div>",
                div = ".floor-canvas#L" + visual.floorEdit;
            
            $(divToolBar).appendTo(div);
            $(div).addClass("floor-edit-frame");
            
            console.log("DIV " + div);
            console.log("EF " + visual.floorEdit);
            
            $(".floor-edit-toolbar").slideToggle("fast");
            
            $(".floor-edit-toolbar #delete-floor").click(function (e) {
                console.log("DELETE FLOOR");
                $('#popup-confirm').popup('open');
                
                $("#popup-confirm #delete").click(function () {
                    visual.divEdit.remove();
                    console.log("DELETE FLOOR2");
                });
                
                e.stopPropagation();
            });
            
            $(".floor-edit-toolbar #edit-floor").click(function (e) {
                console.log("EDIT FLOOR");
                
                $('#popup-conf-floor #level').val(visual.divEdit.data("entry").level);
                $('#popup-conf-floor #name').val(visual.divEdit.data("entry").name);
                $('#popup-conf-floor #descrip').val(visual.divEdit.data("entry").descrip);
                $('#popup-conf-floor #curr-img').text(visual.divEdit.data("entry").url.split('/').pop());
                $('#popup-conf-floor #url').val(visual.divEdit.data("entry").url);
                
                $('#popup-conf-floor').popup('open');
                
                e.stopPropagation();
            });
            
            $(".floor-edit-toolbar #left-shift-floor").click(function (e) {
                console.log("LEFT SHIFT FLOOR");

                var floor = visual.divEdit.data("entry"),
                    floortmp,
                    prevDiv = null,
                    nd;
                 
                if (floor.level > 0) {
                    prevDiv = visual.getFloorCanvasDiv(floor.level - 1);
                    nd = ".floor-canvas#L" + (floor.level - 1);
                    
                    if (prevDiv !== null) {
                        floortmp = prevDiv.data("entry");
                        floortmp.level++;
                        prevDiv.data("entry", floortmp);
                        prevDiv.find("p").first().text(floortmp.name + " (" + floortmp.level + ")");
                        $(nd).attr('id', 'L' + floortmp.level);
                    }
                    
                    visual.divEdit.remove();
                    floor.level--;
                    visual.addFloor(floor);
                }
                
                e.stopPropagation();
               
            });
            
            $(".floor-edit-toolbar #right-shift-floor").click(function (e) {
                console.log("RIGHT SHIFT FLOOR");

                var floor = visual.divEdit.data("entry"),
                    floortmp,
                    nextDiv = null,
                    nd;
                 
                if (floor.level < 999) {
                    nextDiv = visual.getFloorCanvasDiv(floor.level + 1);
                    nd = ".floor-canvas#L" + (floor.level + 1);
                    
                    if (nextDiv !== null) {
                        floortmp = nextDiv.data("entry");
                        floortmp.level--;
                        nextDiv.data("entry", floortmp);
                        nextDiv.find("p").first().text(floortmp.name + " (" + floortmp.level + ")");
                        $(nd).attr('id', 'L' + floortmp.level);
                    }
                    visual.divEdit.remove();
                    floor.level++;
                    visual.addFloor(floor);
                }
                
                e.stopPropagation();
            });
        });
        
        
        $(floorCanvas).click(function (event) {
            console.log("PULSACION CORTA");
             
            $(".floor-edit-toolbar").slideToggle("fast");
            $(".floor-edit-toolbar").remove();
            $(".floor-canvas#L" + visual.floorEdit).removeClass("floor-edit-frame");
            
            visual.floorEdit = -1;
            visual.divEdit = null;
            
            var imageObj = new Image(),
                ctx = $('.main-canvas')[0].getContext('2d'),
                ch = ctx.canvas.height,
                cw = ctx.canvas.width,
                dx = 0,
                dy = 0,
                w,
                h,
                maxHeight,
                maxWidth;
            
            imageObj.src = $(this).data("entry").url;
            $('.main-canvas').attr('width', $('#floor-panel').width());
            $('.main-canvas').attr('height', $('#page-visual .ui-content').height());

       /* if (cw > imageObj.naturalWidth)
        {
            dx = (cw - imageObj.naturalWidth) * .5;
            esx = 1;
        }

        if (ch > imageObj.naturalHeight)
        {
            dy = (ch - imageObj.naturalHeight) * .5;
            esy = 1;
        } 
        */
            h = imageObj.naturalHeight;
            w = imageObj.naturalWidth;
            maxWidth = ctx.canvas.width;
            maxHeight = ctx.canvas.height;

            if (w < h) {
                h = (h * maxWidth) / w;
                w = maxWidth;
            } else {
                w = (w * maxHeight) / h;
                h = maxHeight;
            }
          /***  
            ctx.beginPath();
$('.main-canvas')[0].getContext('2d').moveTo(0,50);
$('.main-canvas')[0].getContext('2d').lineTo(50,50);
$('.main-canvas')[0].getContext('2d').stroke();
        ***/
            dx = Math.abs(w - maxWidth) * 0.5;
            dy = Math.abs(h - maxHeight) * 0.5;

            ctx.drawImage(imageObj, parseInt(dx, 10), parseInt(dy, 10), parseInt(w, 10), parseInt(h, 10));

            /*console.log("IMAGEN FONDO: " +  $(this).data("entry").url + " x: " + imageObj.naturalWidth + " y: " + imageObj.naturalHeight + "  wi: " + wi + " hi: " + hi + " ch: " + ch + " cw:" + cw + "  dx:" + dx + " dy:" + dy + "ctxw: " + ctx.canvas.width + "  ctxh: " + ctx.canvas.height) ; */
            
            console.log("COLOR " + $(this).data("entry").invColor);
            if ($(this).data("entry").invColor === "on") {
                helpImage.invertColor(ctx, dx, dy, imageObj);
            }
        });
         
    },
    
    getFloorCanvasDiv: function (level) {
        "use strict";
        
        var returnDiv = null;
        
        $("#floor-panel .floor-canvas").each(function (index) {
            var data = $(this).data("entry");
       
            console.log("GFCnivel: " + index);
            if (data) {
                console.log("GFCnivel: " + index + "  " + data.level + "  " + level);
                
                if (data.level === level) {
                    returnDiv = $(this);
                    
                    console.log("ENCONTRADO  " + data.name);
                    return false;
                }
            }
        });
        
        return returnDiv;
    },
    
    saveLocation: function () {
        visual.local.cleanFloors();

        $("#floor-panel .floor-canvas").each(function (index) {
            var data = $(this).data("entry"),
                floor;

            if (data) {
                if (data.level === 999) {
                    return false;
                }

                floor = new Floor(data.level, data.name,
                              data.descrip, data.url,
                              data.invColor);

                visual.local.addFloor(floor);
            }
        });
        
        visual.local.save();
        
        visual.saved = true;
    }
    
};
