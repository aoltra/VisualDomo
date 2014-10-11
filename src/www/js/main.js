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
        $(document).on("pagebeforeshow", "#file-dialog", function () {
            
            var parameters =  $(this).data("url").split('?');
            fileDialog.initialize(parameters[1]);
            
        });
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

    getConnectionFeatures: function (root, successCallback, errorCallback) {
        "use strict";
        
        var path = 'VisualDomo/locations';
        
        root.getDirectory(path, {},

            // Successful request of directory
            function (dirEntry) {
                
                helpFile.readDirectoryEntries(dirEntry,
                    function (results) {
                        var found = false, name;
                        
                        results.forEach(function (value, index) {
                            if (value.isDirectory) {
                                console.log(index + "-" + value.name);

                                name = value.name.substring(0, value.name.length - 4);
                                if (name === app.BSSID) {
                                    found = true;
                                }
                            }
                                    
                            successCallback(found);
                        });
                    });
            },
            function () {
                errorCallback(); // TODO: show message in mobile screen
            });

    },

    // Show main menu
    showMainMenu: function () {
        "use strict";
        
        var $divSplash = $('.sp-logo'),
            networkState = navigator.connection.type,
            $el1 = $('.link-newlocation'),
            $el2 = $('.link-conf-location');


        // 3G network
        if (networkState === Connection.CELL_2G && networkState === Connection.CELL_3G && networkState === Connection.CELL_4G && networkState === Connection.CELL) {
            $("#mm-assignlocation").css("border", "3px solid red");
            $("#mm-configure").css("border", "3px solid red");
            $('.sp-info #tx-SSID').text("3G");
        }

        if (networkState === Connection.WIFI) {
            wifiinfo.getBSSID(
                function (BSSID) {
                    console.log("BSSID: " + BSSID);
                    app.getConnectionFeatures(app.root,
                        function (found) {
                            // run the visual screen mode use
                        },
                        function () {
                            $("#mm-assignlocation").css("border", "3px solid red");
                            $("#mm-external").css("border", "3px solid red");
                        });
                },
                function (error) {
                    console.log("Error wifiinfo.getBSSID: " + error);
                }
            );
            
            wifiinfo.getSSID(
                function (SSID) {
                    app.SSID = SSID.replace(/\"/g, '');
                    if (app.SSID === "") {
                        app.SSID = "Sin nombre";
                    }
                    $('.sp-info #tx-SSID').text(app.SSID);
                },
                function (error) {
                    console.log("Error wifiinfo.getSSID: " + error);
                }
            );
        }

        if (networkState === Connection.NONE || networkState === Connection.UNKNOWN || networkState === Connection.ETHERNET) {
            $("#mm-external").css("border", "3px solid red");
            $("#mm-assignlocation").css("border", "3px solid red");
            $('.sp-info #tx-SSID').text("");
            $('.sp-info #tx-connected').text("Sin conexión");
        }
        
        // set content area page-visual 100% screen
        $(document).on('pageshow', '#page-visual', function () {
            var height = ($(window).height() - $(this).find('[data-role="header"]').height());
            $(this).height($(window).height()).find('[data-role="content"]').height(height);
        });
        
        
        $el1.onclick = visual.initialize();
        $el1.onclick = selectLocal.initialize();
        
        $('.sp-image').parent().bind('transitionend webkitTransitionEnd', function () {
            $('.sp-info').css('visibility', 'visible');
            $('.mm-menu').css('visibility', 'visible');
        });
        $('.sp-loading').css('display', 'none');
        
        
        $divSplash.addClass('verticalTranslate');
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
    
    // show a good looking alert dialog
    showAlert: function (title, txt) {
        "use strict";
        
        $("#dialog").attr("title", title);
        $("#dialog").text(txt);
        $("#dialog").dialog();
    }
    
};
