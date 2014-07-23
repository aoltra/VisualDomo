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
/*global Connection, $, helpFile, wifiinfo, console, LocalFileSystem */

var app = {
    
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

        // Create VisualDomo directories
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,

            // Successful request of a file system
            function (fileSystem) {
                var path = "VisualDomo/locations";
                helpFile.createDirectories(fileSystem.root, path.split('/'));
            },
           
            helpFile.errorHandler
            );

        app.showMainMenu();

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

    },

    // Show main menu
    showMainMenu: function () {
        "use strict";
        
        var $divSplash = $('.sp-logo'), networkState = navigator.connection.type;

        if (networkState === Connection.CELL_2G && networkState === Connection.CELL_3G && networkState === Connection.CELL_4G && networkState === Connection.CELL) {
            $("#mm-configurethis").css("border", "3px solid red");
            $("#mm-assignlocation").css("border", "3px solid red");
        }

        if (networkState === Connection.WIFI) {
            wifiinfo.getBSSID(
                function (BSSID) {
                    console.log("BSSID: " + BSSID);
                },
                function (error) {
                    console.log("Error wifiinfo: " + error);
                }
            );
        }

        if (networkState === Connection.NONE || networkState === Connection.UNKNOWN || networkState === Connection.ETHERNET) {
            $("#mm-configurethis").css("border", "3px solid red");
            $("#mm-assignlocation").css("border", "3px solid red");
            $("#mm-external").css("border", "3px solid red");
        }
        
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
    }
};
