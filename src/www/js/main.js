/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          3/7/2014
 *
 * Espacio de nombres app
 *
 * app namespace
 */

/* JSLint options */
/*global Connection, $, helpFile, wifiinfo, console, LocalFileSystem, visual, fileDialog, selectLocal */

var app = {
    
    SSID: null,
    BSSID: null,
    root: null,
    networkState: null,
    updateTime: 45000,
    functionPortsFonts: [ 'a', 'j', 'z', 's', 't', 'r' ],
    
    // Application Constructor
    initialize: function () {
        "use strict";
        
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        "use strict";
        
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        "use strict";
        
        app.receivedEvent('deviceready');
        
        // beforeshow events
        // lib: FileDialog
   /*     $(document).on("pagebeforeshow", "#file-dialog", function () {
            
            var parameters =  $(this).data("url").split('?');
            fileDialog.initialize(parameters[1]);
            
        });*/
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        "use strict";
        
        console.log('Received Event: ' + id);

     //   var odc1 = new ODControl(1,"odc1","prueba","local.opendomo.com","user","opendomo");

     //   var text = document.createTextNode(odc1.version);
     //   var text = odc1.version;
     //   console.log('VERSION: ' + text);        
     //   var child = document.getElementById('listaodc');
     //   child.appendChild(text); 

        // Create VisualDomo directories
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                                 
            // Successful request of a file system
            function (fileSystem) {
                var path = "VisualDomo/locations";
                
                app.root = fileSystem.root;
                helpFile.createDirectories(fileSystem.root, path.split('/'),
                    function () {
                        
                        app.networkState = navigator.connection.type;
                        
                        console.log("TIPO CONEXION:" + app.networkState);
                     
                        wifiinfo.getBSSID(
                            function (BSSID) {
                                if (BSSID !== null) {
                                    console.log("BSSID: " + BSSID);
                                    app.BSSID = BSSID.replace(/\"/g, '');
                                }
                            },
                            function (error) {
                                console.log("Error wifiinfo.getBSSID: " + error);
                            }
                        );
                        
                        wifiinfo.getSSID(
                            function (SSID) {
                                if (SSID !== null) {
                                    app.SSID = SSID.replace(/\"/g, '');
                                    if (app.SSID === "") {
                                        app.SSID = "Sin nombre";
                                    }
                                }
                            },
                            function (error) {
                                console.log("Error wifiinfo.getSSID: " + error);
                            }
                        );
                    
                        app.showMainMenu();
                    },
                    function () {   // Not used
                        navigator.app.exitApp();
                    });
            },
           
            function () {
                helpFile.errorHandler(); // TODO: show message in mobile screen
                navigator.app.exitApp();
            });
    },

    // Show main menu
    showMainMenu: function () {
        "use strict";
        
        var $divSplash = $('.sp-logo'),
            el1 = $('#mm-newlocation'),
            el2 = $('#mm-configure'),
            el3 = $('#mm-assignlocation');
        
        visual.initialize();
        selectLocal.initialize(function () {

            // 3G network
            if (app.networkState === Connection.CELL_2G || app.networkState === Connection.CELL_3G
                    || app.networkState === Connection.CELL || app.networkState === '3g'
                    || app.networkState === '4g' || app.networkState === Connection.CELL_4G) {
//                $("#mm-assignlocation").css("border", "3px solid red");
//                $("#mm-configure").css("border", "3px solid red");
                $('.sp-info #tx-SSID').text("3G/4G");
            }
        
            if (app.networkState === Connection.WIFI) {
                
                $('.sp-info #tx-SSID').text(app.SSID);
                
                if (selectLocal.currentLocal !== null) {
                    var floorSelect;
                    
//                    visual.setUse(1);
//                    visual.loadLocation(selectLocal.currentLocal);
//                    $(":mobile-pagecontainer").pagecontainer("change", "#page-visual");
//                    
                }
            }

            if (app.networkState === Connection.NONE || app.networkState === Connection.UNKNOWN || app.networkState === Connection.ETHERNET) {
//                $("#mm-external").css("border", "3px solid red");
//                $("#mm-assignlocation").css("border", "3px solid red");
                $('.sp-info #tx-SSID').text("");
                $('.sp-info #tx-connected').text("Sin conexión");
            }
                    
            $('.sp-image').parent().bind('transitionend webkitTransitionEnd', function () {
                $('.sp-info').css('visibility', 'visible');
                $('.mm-menu').css('visibility', 'visible');
            });
            $('.sp-loading').css('display', 'none');
        
            $divSplash.addClass('verticalTranslate');
        });
        
        // set content area page-visual 100% screen
        $(document).on('pageshow', '#page-visual', function () {
            var height = ($(window).height() - $(this).find('[data-role="header"]').height());
          //  $(this).height($(window).height()).find('[data-role="content"]').height(height);
        });
        
        $(":mobile-pagecontainer").pagecontainer({
            change: function (event, ui) {
                if (ui.toPage.find("#floor-panel").length > 0) {
                    if ($("#floor-panel .floor-canvas").length > 0) {
                        visual.setFloorInCanvas($("#floor-panel .floor-canvas").get(0));
                    }
                }
            }
        });
        
        $("#mm-visualize").click(function () {
            if (selectLocal.currentLocal !== null) {
                visual.setUse(1);
                visual.loadLocation(selectLocal.currentLocal);
                $(":mobile-pagecontainer").pagecontainer("change", "#page-visual", { reload: "true" });
            } else {
                app.alert("No está definida la localización actual", true, 1);
                                    
                window.setTimeout(function () {
                    app.alert("", false);
                }, 1350);
            }
        });
        
        $("#mm-newlocation").click(function () {
            visual.setUse(0);
            $(":mobile-pagecontainer").pagecontainer("change", "#page-visual", { reload: "true" });
        });
        
        $("#mm-configure").click(function () {
            selectLocal.setUse(0);
            $(":mobile-pagecontainer").pagecontainer("change", "#page-select-local", { reload: "true" });
        });
         
        $("#mm-assignlocation").click(function () {
            var sSID = $('.sp-info #tx-SSID').text();
            
            if (sSID === "" || sSID === "3G/4G") {
                app.alert("Es necesario estar conectado a una red Wifi", true, 1);
                                    
                window.setTimeout(function () {
                    app.alert("", false);
                }, 1350);
            } else {
                selectLocal.setUse(1);
                $(":mobile-pagecontainer").pagecontainer("change", "#page-select-local", { reload: "true" });
            }
        });
       
        $("#mm-external").click(function () {
            app.alert("Opción no soportada en esta versión", true, 0);
                                    
            window.setTimeout(function () {
                app.alert("", false);
            }, 1350);
        });
    },
    
    // HTTP GET request to access ODControl
    httpGetRequestToODControl: function (url, syn, user, pass, callbackFun) {
        "use strict";
        
        var response, request = new XMLHttpRequest();
        
        // FIX: There is a bug in ODControl firmware and the HTTP header is not send (8/7/2014)
        if (syn === true) {
            request.open("GET", "http://"   + url, true, user, pass);
            
            // Call a function when the state changes
            request.onreadystatechange = function () {
                if (request.readyState === 4) {

                    if (request.status === 200 || request.status === 0) {
                        response = request.responseText;
                        console.log("asynRES: " + response + " " + request.status);
                    
                        callbackFun(response);
                    }
                }
            };
        } else {
            request.open("GET", "http://" + url, false, user, pass);
        }

        request.send(null);
        
        if (syn === false) {
            response = request.responseText;
            console.log("synRES: " + response);
        }

        return response;
    },
    
    // show a alert dialog
    alert: function (txt, show, params) {
        "use strict";
     
        if (show === true) {
            $(".alert").css("display", "block");
            $(".alert p").text(txt);
            $(".alert").css("margin-left", "-" + $(".alert").width() / 2 + "px");
           
        } else {
            $(".alert").css("display", "none");
        }
        
        if (params !== null) {
        
            switch (params) {
            case 0:             // INFO
                $(".alert #alert-icon").text('u');
                break;

            case 1:             // ERROR
                $(".alert #alert-icon").text('p');
                break;

            case 2:             // WARNING
                $(".alert #alert-icon").text('v');
                break;
            }
        }
        
    }
    
    
    
    
};
