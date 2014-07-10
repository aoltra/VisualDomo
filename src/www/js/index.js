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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        app.receivedEvent('deviceready');

        // Requesting a file system
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 

            // Successful request of a file system
            function (fileSystem) { 
                var path = "VisualDomo/locations";
                helpFile.createDirectories(fileSystem.root,path.split('/'));
            },
           
            helpFile.errorHandler
        );

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        var odc1 = new ODControl(1,"odc1","prueba","local.opendomo.com","user","opendomo");

        var text = document.createTextNode(odc1.version);
        console.log('VERSION: ' + text);        
        var child = document.getElementById('listaodc');
        child.appendChild(text); 


        
    },
    // HTTP GET request to access ODControl
    httpGetRequestToODControl: function(url,syn,user,pass,callbackFun) {
        var response;
        var request = new XMLHttpRequest();
        
        // FIX: There is a bug in ODControl firmware and the HTTP header is not send (8/7/2014)
        if (syn == true) {
            request.open("GET", "http://"   + url, true, user, pass);
            
            // Call a function when the state changes
            request.onreadystatechange = function() 
            {
                if (request.readyState == 4) {

                    if (request.status == 200 || request.status == 0) {
                        response = request.responseText;
                        console.log("asynRES: " + response + " " + request.status);
                    
                        callbackFun(response);
                    }

                }
            }
        }
        else
            request.open("GET", "http://" + url, false, user, pass);

        request.send(null);
        
        if (syn == false)
        {
            response = request.responseText;
            console.log("synRES: " + response);
        }

        return response;
    },


};
