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
/*global Connection, $, helpFile, helpImage, wifiinfo, console, LocalFileSystem, Location, Floor, Port, ODControl, selectLocal, app */
/*jslint plusplus: true*/

var visual = {
    
    // MEMBERS
    floorEdit: -1,
    floorCurrent: null,
    odcEdit: -1,
    divEdit: null,
    local: null,
    noConfig: false,
    saved: false,
    headerHeight: 0,
    dragPort: null,
    use: 0,             // current use 0: config local, 1: visual mode
    refreshLoop: null,
    openConfLocation: false,
    
    
    // FUNCTIONS
    // Visual Constructor
    initialize: function () {
        "use strict";
        
        var canvas;
       /* $('.port').bind('click', function(e) {       
            console.log("cilclclclclcl");       
            e.stopPropagation();
            e.stopImmediatePropagation();          
        });    
        */
        $("#button-open-floor-panel").click(function () {
            var height;
            
            if ($('#floor-panel').css('display') === 'block') {
                height = '-=' + $('#floor-panel').height();
                $(this).text('x');
            } else {
                height = '+=' + $('#floor-panel').height();
                $(this).text('y');
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
                        imgHideName = $('#popup-conf-floor #URL');

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
            visual.saved = false;
            visual.updateName(visual.local.name);
        });
        
        // cancel button conf floor
        $("#popup-conf-floor :button").click(function (event) {
            $('#popup-conf-floor').popup('close');
            $('#popup-conf-floor form')[0].reset();
        });
     
        $("#floor-panel #add-floor").data("entry", { "level": 999 });
           
        $("#page-visual #config-menu #about-item").click(function (event) {
        
            $("#config-menu").popup('close');
            
            console.log("ABOUT");
            
            visual.aboutShow();
                                    
            window.setTimeout(function () {
                visual.aboutHide();
            }, 5000);
        });
            
        $("#page-visual #config-menu #save-item").click(function (event) {
        
            $("#config-menu").popup('close');
            
            console.log("CONF LOCAL " + visual.local.name);
            
            if (visual.local.name === "") {
                
                visual.noConfig = true;
                visual.openConfLocation = true;
                // Open a popup from other popup
                $('#config-menu').on({
                    popupafterclose: function () {
                        if (visual.openConfLocation === true) {
                            if (visual.noConfig === true) {
                                setTimeout(function () {
                                    $('#popup-conf-location').popup('open');
                                }, 100);
                                
                                visual.openConfLocation = false;
                            }
                        }
                    }
                });
            } else {
                visual.saveLocation();
                visual.updateName(visual.local.name);
            }
            
            console.log("GRABANDO");
        });
        
        
        $("#page-visual #config-menu #config-item").click(function (event) {
        
            $("#config-menu").popup('close');
            
            console.log("CONF LOCAL " + visual.local.name);

            visual.openConfLocation = true;
            
            // Open a popup from other popup
            $('#config-menu').on({
                popupafterclose: function () {
                    if (visual.openConfLocation === true) {
                        setTimeout(function () {
                            
                            $('#popup-conf-location #name').val(visual.local.name);
                            $('#popup-conf-location #description').val(visual.local.description);
                            $('#popup-conf-location').popup('open');
                        }, 100);
                        
                        visual.openConfLocation = false;
                    }
                }
            });
        });
        
        $("#page-visual #odc-add").click(function (event) {
        
            $("#odc-panel").panel("toggle");
            $('#popup-add-odcontrol').popup('open');
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
            
            if (localData.name.indexOf(" ") > -1) {
                app.alert("El nombre de la localización no puede contener espacios", true, 1);
                                    
                window.setTimeout(function () {
                    app.alert("", false);
                }, 1550);
                
                return false;
            }
            
            if (selectLocal.existLocation(localData.name) === true) {
                 
                app.alert("Ya existe una localización con ese nombre. No es posible grabar la localización", true, 1);
                                    
                window.setTimeout(function () {
                    app.alert("", false);
                }, 1550);
            
                return false;
            }
            
            if (localData.name === "") {
                app.alert("No se ha definido un nombre para la localización", true, 1);
                                    
                window.setTimeout(function () {
                    app.alert("", false);
                }, 1550);
                
                return false;
            }
            
            visual.local.name = localData.name;
            visual.local.description = localData.description;

            if (visual.noConfig === true) {
                visual.saveLocation();
                visual.updateName(visual.local.name);
                visual.noConfig = false;
            }


        });
        
        // cancel button conf floor
        $("#popup-conf-location :button").click(function (event) {
            $('#popup-conf-location').popup('close');
            $('#popup-conf-location form')[0].reset();
        });
        
        $("#popup-add-odcontrol #odc-add-ok").click(function (event) {
            
            var nODC, odc;

        /*    $.each($('#popup-add-odcontrol form').serializeArray(), function () {

                if (newodc[this.name]) {
                    if (!newodc[this.name].push) {
                        newodc[this.name] = [newodc[this.name]];
                    }
                    newodc[this.name].push(this.value || '');
                } else {
                    newodc[this.name] = this.value || '';
                }
            });
          */
            
            //odc.IP = "90.166.105.5";
            //odc.user = "user";
            //odc.password = newodc.passowrd;
            
            odc = new ODControl("", "control1", "", "90.166.105.5", "user", "opendomo");
             
            visual.local.addODControl(odc);
            nODC = visual.local.numberODC();
            if (nODC > 0) {
                $("#odc-list").css("display", "inline");
                $("#noODC").css("display", "none");
            }

            $('#popup-add-odcontrol').popup('close');
            $('#popup-add-odcontrol form')[0].reset();
            
            visual.addODControl(odc, null);
            visual.saved = false;
            visual.updateName(visual.local.name);
           
        });
        
        $("#popup-conf-aport-value #aport-value-conf-ok").click(function (event) {

            var localPort = {}, odc, port;
             
            $.each($('#popup-conf-aport-value form').serializeArray(), function () {

                if (localPort[this.name]) {
                    if (!localPort[this.name].push) {
                        localPort[this.name] = [localPort[this.name]];
                    }
                    localPort[this.name].push(this.value || '');
                } else {
                    localPort[this.name] = this.value || '';
                }
            });
            
            $('#popup-conf-aport-value').popup('close');
            
            $('#popup-conf-aport-value form')[0].reset();
             
            odc = $("#popup-conf-aport-value").data('odc');
            port = $("#popup-conf-aport-value").data('port');

            odc.ports[port].value = localPort.value;
            odc.setPort(odc.ports[port]);
           
        });
        
        // cancel button
        $("#popup-conf-aport-value :button").click(function (event) {
            $('#popup-conf-aport-value').popup('close');
            $('#popup-conf-aport-value form')[0].reset();
        });
        
        
         // cancel button
        $("#popup-conf-aport :button").click(function (event) {
            $('#popup-conf-aport').popup('close');
            $('#popup-conf-aport form')[0].reset();
        });
        
        
        $("#odcontrol-panel").click(function (event) {
            $("#odc-panel").panel("toggle");
        });
     
        visual.local = new Location("", "", "");
        
        $("#odc-list").css("display", "none");
            
        $("#page-visual").on("pageshow", function (event) {
            //BETA
            var json_config,
                screen = $.mobile.getScreenHeight(),
                header = $("#page-visual .ui-header").hasClass("#page-visual ui-header-fixed") ? $("#page-visual .ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight(),
                footer = $("#page-visual .ui-footer").hasClass("#page-visual ui-footer-fixed") ? $("#page-visual .ui-footer").outerHeight() - 1 : $("#page-visual .ui-footer").outerHeight(),
                contentCurrent = $("#page-visual .ui-content").outerHeight() - $("#page-visual .ui-content").height(),
                content = screen - header - footer;// - contentCurrent;

            visual.headerHeight = header;

            console.log("HEADER: " + visual.headerHeight + "  " + content + " " + header + " " + screen + " " + footer);

            $("#page-visual .ui-content").height(content);
        });
       
  
        // Drag and drop canvas
        canvas = $('.main-canvas')[0];
        canvas.addEventListener('touchmove', function (event) {
            
            if (visual.use === 1) {
                return;
            }
            
            console.log("DRAG!!");
            
            //Assume only one touch/only process one touch even if there's more
            var touch = event.targetTouches[0], i, j, odc, exit = false;
 
            if (visual.dragPort !== null && visual.dragPort.detectHit(touch.pageX, touch.pageY - visual.headerHeight, true)) {
                visual.drawCanvas();
            } else {
                // Is touch close enough to our object?
                for (i = 0; i < visual.local.odcontrols.length; i++) {

                    odc = visual.local.odcontrols[i];

                    for (j = 0; j < odc.ports.length; j++) {

                        if (odc.ports[j].placed === true && odc.ports[j].level === visual.floorCurrent.level) {
                            if (odc.ports[j].detectHit(touch.pageX, touch.pageY - visual.headerHeight, true)) {

                                visual.dragPort = odc.ports[j];
                                // Redraw the canvas
                                visual.drawCanvas();
                                exit = true;
                                break;
                            }
                        }
                    }

                    if (exit) {
                        break;
                    }
                }
            }
            event.preventDefault();
        }, false);
        
        canvas.addEventListener('touchstart', function (event) {
             
            if (visual.use === 0) {
                return;
            }

            console.log("TOUCH!!");
            
            //Assume only one touch/only process one touch even if there's more
            var touch = event.targetTouches[0], i, j, odc, exit = false;
           
            for (i = 0; i < visual.local.odcontrols.length; i++) {

                odc = visual.local.odcontrols[i];

                for (j = 0; j < odc.ports.length; j++) {

                    if (odc.ports[j].placed === true && odc.ports[j].level === visual.floorCurrent.level) {
                        if (odc.ports[j].detectHit(touch.pageX, touch.pageY - visual.headerHeight, false)) {

                            console.log("tocandoooooooo");
                            if (odc.ports[j].input === 'O') {
                                if (odc.ports[j].type === 'D') {
                                    if (odc.ports[j].value === "ON") {
                                        odc.ports[j].value = "OFF";
                                    } else {
                                        odc.ports[j].value = "ON";
                                    }
                                    
                                    odc.setPort(odc.ports[j]);
                                } else {
                                    
                                    $('#popup-conf-aport-value #value').val(odc.ports[j].value);
                                    $('#popup-conf-aport-value h4').text("Valor entre (" + odc.ports[j].min + " / " + odc.ports[j].max + ")");
                                    $('#popup-conf-aport-value').data('odc', odc);
                                    $('#popup-conf-aport-value').data('port', j);
                                    $('#popup-conf-aport-value').popup('open');
                                    
                                    event.stopPropagation();
                                }
                                
                            } else {
                                app.alert("¡Puerto de entrada!", true, 0);
                                    
                                window.setTimeout(function () {
                                    app.alert("", false);
                                }, 1550);
                            }
                                
                            // Redraw the canvas
                            visual.drawCanvas();
                            exit = true;
                            break;
                        }
                    }
                }

                if (exit) {
                    break;
                }
            }
            event.preventDefault();
        }, false);
    },
    
    setUse: function (use) {
        "use strict";
        
        visual.use = use;
        
        console.log("USO VISUAL: " + visual.use);
        
        if (visual.use === 0) {
            $("#odcontrol-panel").css('visibility', 'visible');
            clearTimeout(visual.refreshLoop);
            $("#config-menu #config-item").css('display', 'block');
            $("#config-menu #save-item").css('display', 'block');
        } else {
            $("#odcontrol-panel").css('visibility', 'hidden');
            $("#config-menu #config-item").css('display', 'none');
            $("#config-menu #save-item").css('display', 'none');
            visual.updatePorts();
            visual.refreshPorts();
        }
        
    },
    
    refreshPorts: function () {
        "use strict";
        
        visual.refreshLoop = window.setTimeout(function () {
            visual.updatePorts();
            visual.refreshPorts();
        }, app.updateTime);
      
    },
    
    updateName: function (name) {
        "use strict";
        
        var saved, complexName;
            
        if (visual.saved === false) {
            saved = '*';
        } else {
            saved = '';
        }
        
        if (name === "") {
            complexName = "";
        } else {
            complexName = " - " + name;
        }
        
        $("#page-visual #header-visual-location").text("VisualDomo" + saved + complexName);
    },
    
    loadLocation: function (location) {
        "use strict";
        
        var odc;
        
        // clean previous location
        visual.cleanCurrentLocation();
        
        visual.saved = true;
        visual.updateName(location.name);
        
        visual.local = null;
        visual.local = new Location(location.BSSID, location.name, location.description);
        
        visual.local.assign(location.BSSID, location.SSID);
       
        location.odcontrols.forEach(function (entry) {
            odc = new ODControl(visual.local.numberODC(), entry.name, "", entry.IP, entry.user, entry.password);
            visual.local.addODControl(odc);
            visual.addODControl(odc, entry.ports);
        });
        
        if (location.odcontrols.length > 0) {
            $("#odc-list").css("display", "inline");
            $("#noODC").css("display", "none");
        } else {
            $("#odc-list").css("display", "none");
            $("#noODC").css("display", "inline");
        }

        location.floors.forEach(function (entry) {
            visual.addFloor(entry);
        });
    },
    
    addODControl: function (odcontrol, readPorts) {
        "use strict";
        
        var nODC, collapsible, header, text, ports, lsc, collapsiblePort, divPort,
            type, input, placed, funct;
        
        console.log("ADD ODCONTROL");
    
        nODC = visual.local.numberODC();
        collapsible = $("<div data-role='collapsible' data-mini='true' data-inset='false' class='collapsible-item' id='odc-" + odcontrol.ID + "'></div>");
        $("#odc-panel #odc-list").append(collapsible);
        
        header = $("<h1>" + odcontrol.name + "</h1>");
        $(collapsible).append(header);
        
    //    $(collapsible).data("numero", nODC);
        $(collapsible).data("entry", odcontrol);
      
        text = "ODControl (" + nODC + ")";
        $("#page-visual #odcontrol-panel").text(text);

        if (readPorts === null) {
            lsc = odcontrol.readPorts();
            ports = lsc.split('\n');
        } else {
            ports = readPorts;
        }
        
        if (ports.length > 1 || (ports.length > 0 && readPorts !== null)) {  // last row is always DONE
           
            collapsiblePort = $("<p></p>");
            collapsiblePort.insertAfter(header);
        
            ports.forEach(function (entry) {
                var parts = new Array(), port;
                
                if (readPorts === null) {
                    parts = entry.split(":");
                } else {
                    parts[0] = entry.name;
                    parts[1] = entry.type + entry.input + "M";
                    parts[2] = entry.value;
                }
                
            //    console.log("Nombre " + parts[0] + "," + parts[1] + "," + parts[2] + " en " + entry);
                
                if (undefined !== parts[1]) {

              //      console.log("partes " + parts[0] + " " + parts[1] + "  " + parts[2] + " >" + parts[1].charAt(2) + "<");

                    if (parts[1].charAt(2) !== "H") {
        
                        port = new Port(parts[0], parts[1].charAt(0), parts[1].charAt(1), "");
                        
                        if (readPorts !== null) {
                            port.create(entry);
                        } else {
                            if (parts[1].charAt(0) === 'A') {
                                port.min = parts[3].split('|')[0];
                                port.max = parts[3].split('|')[1];
                            }
                            
                            port.value = parts[2];
                        }
                        
                        if (parts[1].charAt(0) === 'A') {
                            type = 'a';
                        } else {
                            type = 'j';
                        }
                        
                        if (parts[1].charAt(1) === 'I') {
                            input = 'c';
                        } else {
                            input = 'd';
                        }
                        
                        odcontrol.addPort(port);
                        
                        if (port.placed === true) {
                            placed = 'q';
                        } else {
                            placed = ' ';
                        }
                        
                        funct = port.icon();
                        
                        divPort = $("<div class='collapsible-port'><span class='port-icon' >" + type + " " + input + " </span><span class='port-content'>" + parts[0] + "</span><span class='port-placed'>" + placed + "</span><span class='port-funct'>" + funct + "</span></div>");
                        $(divPort).data("entry", port);
                        $(collapsiblePort).append(divPort);
                    }
                }
            });
            
            // put it in center of canvas
            $(".collapsible-port .port-content").click(function (event) {
                console.log("PUT PORT IN CANVAS");
                
                var port = $(this).parent();
                
                if (visual.floorCurrent === null) {
                    app.alert("No es posible ubicar el puerto", true, 0);
                    
                    window.setTimeout(function () {
                        app.alert("", false);
                    }, 1250);
                    
                } else {
                    port.data("entry").level = visual.floorCurrent.level;
                    port.data("entry").placed = true;
                    
                    port.data("entry").posY = Math.round($('.main-canvas')[0].getContext('2d').canvas.height * 0.5);
                    port.data("entry").posX = Math.round($('.main-canvas')[0].getContext('2d').canvas.width * 0.5);
                    
                    port.find(".port-placed").text('q');

                    visual.drawCanvas();
                    
                    visual.saved = false;
                    visual.updateName(visual.local.name);
                }
            });
            
            // remove port in canvas
            $(".collapsible-port .port-placed").click(function (event) {
                console.log("DELETE PORT IN CANVAS");
                
                var port = $(this).parent();
                
                $("#odc-panel").panel("toggle");
                
                $('#popup-confirm h1').text("Borrar puerto");
                $('#popup-confirm h3').text("¿Estás seguro de que quieres quitar este de la localización?");
                $('#popup-confirm').popup('open');
                
                $("#popup-confirm #delete").click(function () {
                    port.data("entry").placed = false;
                    port.find(".port-placed").text(' ');
                    
                    visual.drawCanvas();
                    console.log("DELETING PORT...");
                    
                    $('#popup-confirm').popup('close');
                    
                    visual.saved = false;
                    visual.updateName(visual.local.name);
                });
                
                event.stopPropagation();
            });
            
            // configure port 
            $(".collapsible-port .port-funct").click(function (event) {
                console.log("CONFIGUR PORT");
                
                var port = $(this).parent(), confPort = {}, select, valfunc;
                
                $("#odc-panel").panel("toggle");
                
                $('#popup-conf-port form')[0].reset();
                $('#popup-conf-port #units').val(port.data('entry').units);
                
              //  $("select option[value='B']").attr("selected", "selected");  
                if (port.data('entry').funct === 1) {
                    valfunc = 0;
                } else {
                    valfunc = port.data('entry').funct;
                }
                 
                select = $("#popup-conf-port select option[value='" + valfunc  + "']");
                $(select).attr("selected","selected");
                
                $('#popup-conf-port').popup('open');
    
                $("#popup-conf-port #port-conf-ok").click(function () {
                    
                    $.each($('#popup-conf-port form').serializeArray(), function () {

                        if (confPort[this.name]) {
                            if (!confPort[this.name].push) {
                                confPort[this.name] = [confPort[this.name]];
                            }
                            confPort[this.name].push(this.value || '');
                        } else {
                            confPort[this.name] = this.value || '';
                        }
                    });
                
                    port.data("entry").units = confPort.units;
                    if (confPort.funct == 0 && port.data("entry").type === 'D') {
                        port.data("entry").funct = 1;
                    } else {
                        port.data("entry").funct = confPort.funct;
                    }
                    
                    port.find(".port-funct").text(app.functionPortsFonts[port.data("entry").funct]);
                    visual.drawCanvas();
                    
                    $('#popup-conf-port').popup('close');
                  
                });
                                                          
                // cancel button
                $("#popup-conf-port #port-conf-cancel").click(function (event) {
                    $('#popup-conf-port').popup('close');
                    $('#popup-conf-port form')[0].reset();
                });
                                                          
                event.stopPropagation();
            });
            
            $(collapsible).collapsible();
            
        }
        
        console.log("PUERTO " + odcontrol.ports.length);
  
        $(collapsible).collapsible();
        
        // if you taphold in header of ODC
        $(header).on("taphold",  function (event) {
            console.log("pulsacion larga");
            
            var divBar = $(this).children().last();
    
            if (divBar.hasClass('odc-edit-toolbar') === true) {
               
                $(".odc-edit-toolbar").slideToggle("fast");
                $(".odc-edit-toolbar").remove();
        //    $(".collapsible-item #odc-" + visual.odcEdit).removeClass("odc-edit-toolbar");
                
            } else {
                
                $(".odc-edit-toolbar").slideToggle("fast");
                $(".odc-edit-toolbar").remove();
                
                visual.odcEdit = $(this).data("entry");
            
                var divToolBarODC = "<div class='odc-edit-toolbar'><div class='ui-grid-b'>" +
                    "<div class='ui-block-a button'><p id='edit-odc'>i</p></div>" +
                    "<div class='ui-block-b button'><p id='delete-odc'>n</p></div>" +
                    "<div class='ui-block-c button'><p id='reload-odc'>o</p></div>" +
                    "</div></div>";
                
                //    div = ".collapsible-item#odc-" + visual.odcEdit;

                $(divToolBarODC).appendTo(header);
            }
        });
        
        
    },
    
    addFloor: function (floor) {
        "use strict";
        
        console.log("ADD FLOOR " + JSON.stringify(floor));
        
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
        
        
        floorCanvas = $("<div class='floor-canvas' id='L" + floor.level + "'><img src='" + floor.URL + "'/><p>" + floor.name + " (" + floor.level + ")</p></div>").insertBefore(insertDiv);
        
      //  console.log("ADD FLOOR2 " + JSON.stringify(floorCanvas));
        
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
            
            var divToolBar = "<div class='floor-edit-toolbar'><div class='ui-grid-c'><div class='ui-block-a button'><p id='left-shift-floor'>m</p></div><div class='ui-block-b button'><p id='edit-floor'>i</p></div><div class='ui-block-c button'><p id='delete-floor'>n</p></div><div class='ui-block-d button'><p id='right-shift-floor'>l</p></div></div></div>",
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
                console.log("EDIT FLOOR " + visual.divEdit.data("entry").URL);
                
                $('#popup-conf-floor #level').val(visual.divEdit.data("entry").level);
                $('#popup-conf-floor #name').val(visual.divEdit.data("entry").name);
                $('#popup-conf-floor #descrip').val(visual.divEdit.data("entry").descrip);
                $('#popup-conf-floor #curr-img').text(visual.divEdit.data("entry").URL.split('/').pop());
                $('#popup-conf-floor #URL').val(visual.divEdit.data("entry").URL);
                
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
            
            visual.floorCurrent = $(this).data("entry");
            
            visual.drawCanvas();
        });
         
    },
    
    setFloorInCanvas: function (floorSelect) {
        "use strict";
        
        visual.floorCurrent = $($("#floor-panel .floor-canvas").get(0)).data("entry");
        visual.drawCanvas();
        
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
                    return false;           // exit foreach
                }
            }
        });
        
        return returnDiv;
    },
    
    saveLocation: function () {
        "use strict";
        
        visual.local.cleanFloors();
        visual.local.cleanODControls();

        // add floors to Location
        $("#floor-panel .floor-canvas").each(function (index) {
            var data = $(this).data("entry"),
                floor;

            if (data) {
                if (data.level === 999) {
                    return false;
                }

                floor = new Floor(data.level, data.name,
                              data.descrip, data.URL,
                              data.invColor);

                visual.local.addFloor(floor);
            }
        });
        
        // add odcs and ports
        $("#odc-panel #odc-list .collapsible-item").each(function (index) {
            var odcdata, odc;
            
            odcdata = $(this).data("entry");
            odc = new ODControl(odcdata.ID, odcdata.name, odcdata.description, odcdata.IP, odcdata.user, odcdata.password);
             
            $(this).find(".collapsible-port").each(function (indes) {
                var portdata, port;
                
                portdata = $(this).data("entry");
                port = new Port("", "", "", "");
                port.create(portdata);
               
                odc.addPort(port);
                
            });
            
            visual.local.addODControl(odc);
        });
        
        visual.local.save();
        
        visual.saved = true;
    },
    
    drawCanvas: function () {
        "use strict";
        
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
        
        if (visual.floorCurrent === null) {
            return;
        }
          
        imageObj.src = visual.floorCurrent.URL;
        $('.main-canvas').attr('width', $('#floor-panel').width());
        $('.main-canvas').attr('height', $('#page-visual .ui-content').height());

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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

        dx = Math.abs(w - maxWidth) * 0.5;
        dy = Math.abs(h - maxHeight) * 0.5;

        ctx.drawImage(imageObj, parseInt(dx, 10), parseInt(dy, 10), parseInt(w, 10), parseInt(h, 10));
        /***
        console.log("IMAGEN FONDO: " +  visual.floorCurrent.URL + " x: " + imageObj.naturalWidth + " y: " + imageObj.naturalHeight +  " w:" + w +  " h:" + h + "  dx:" + dx + " dy:" + dy + "ctxw: " + ctx.canvas.width + "  ctxh: " + ctx.canvas.height) ; 
**/
            /*console.log("IMAGEN FONDO: " +  $(this).data("entry").url + " x: " + imageObj.naturalWidth + " y: " + imageObj.naturalHeight + "  wi: " + wi + " hi: " + hi + " ch: " + ch + " cw:" + cw + "  dx:" + dx + " dy:" + dy + "ctxw: " + ctx.canvas.width + "  ctxh: " + ctx.canvas.height) ; */
            
      //  console.log("COLOR " + $(this).data("entry").invColor);
        if (visual.floorCurrent.invColor === "on") {
            helpImage.invertColor(ctx, dx, dy, imageObj);
        }
       
        visual.local.odcontrols.forEach(function (odc) {
            odc.ports.forEach(function (port) {
              //   console.log("loooo2 " + port.placed + "  " + port.level + "  " + visual.floorCurrent.level);
                if (port.placed === true && port.level === visual.floorCurrent.level) {
                //    console.log("lo dibujamos "  + port.name + " " + port.posX + "," + port.posY);
                    port.draw(ctx);
                }
            });
        });
    },
    
    updatePorts: function () {
        "use strict";

        // add odcs and ports
        $("#odc-panel #odc-list .collapsible-item").each(function (index) {
            var odcdata, odc, lsc, ports;
            
            odcdata = $(this).data("entry");
            
            odc = visual.local.odcontrols[odcdata.ID];
            
            lsc = odc.readPorts();
            ports = lsc.split('\n');
            
            $(this).find(".collapsible-port").each(function (index) {
                var portdata, port, value;
                
                value = ports[index].split(":")[2];
                portdata = $(this).data("entry");
                
                portdata.value = value;
                odc.ports[index].value = value;
                
                console.log("INEDEXXXX " + index + "  " + value);
                  
            });
            
        });
         
        visual.drawCanvas();
  
    },

    // show the about box
    aboutShow: function () {
        "use strict";
        
        $(".about").css("display", "block");
        $(".about").css("margin-left", "-" + $(".about").width() / 2 + "px");
        $(".about").css("margin-top", "-" + $(".about").height() / 2 + "px");
    },
      
    // Hide the about box
    aboutHide: function () {
        "use strict";
        
        $(".about").css("display", "none");
        
    },
    
    cleanCurrentLocation: function () {
        "use strict";
        
        // remove floors
        $("#floor-panel .floor-canvas").each(function (index) {
            if ($(this).attr('id') !== "add-floor") {
                $(this).remove();
            }
        });
        
        // remove odcontrol items
        $("#odc-panel #odc-list").children().each(function (index) {
            $(this).remove();                                         
        });
    }
};
