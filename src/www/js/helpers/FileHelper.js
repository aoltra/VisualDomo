/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          10/7/2014
 *
 * Funciones de ayuda al manejo de sistema de archivos
 *
 * Helper functions to handle file system
 */

/* JSLint options */
/*global console, FileError, LocalFileSystem */

var helpFile = {
    
    //rootFolder: helpFile.rootFolder || helpFile.getRootFolder(),
    
    getRootFolder: function () {
        "use strict";

        return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fileSystem) {
                return fileSystem.root;
            },
            helpFile.errorHandler);
    },
    
	// Allow create recursive directories
	// Based on the file tutorial from html5rocks.com 
	createDirectories: function (root, folders, successCallback) {
		"use strict";
        
		if (folders[0] === '.' || folders[0] === '') {
		    folders = folders.slice(1);
		}
		
		root.getDirectory(folders[0], {create: true, exclusive: false},
			function (dirEntry) {
		    	
                if (folders.length - 1) {
                    helpFile.createDirectories(dirEntry, folders.slice(1), null);
                }

                console.log('Directory ' + dirEntry.fullPath + ' created');
			},
			helpFile.errorHandler
            );

        
        if (successCallback !== null) {
            successCallback();
        }
	},

	// Read directories entries
	// Based on the html5rocks.com file tutorial 
	readDirectoryEntries: function (root, successCallback, errorCallback) {
        "use strict";
        
		var dirReader = root.createReader(),
            entries = [],
            read = function () {

                dirReader.readEntries(

                    function (results) {
                        if (!results.length) {
                            successCallback(entries.sort());
                        } else {
                            entries = entries.concat(Array.prototype.slice.call(results || [], 0));
                            read();
                        }
                    },
                    function () {
                        helpFile.errorHandler(); // TODO: show message in mobile screen
                        errorCallback();
                    }
                );
            };

		read();
	},

	// handles a File system error
	errorHandler: function (e) {
        "use strict";
        
        var msg = '';
        
        switch (e.code) {
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        case FileError.SYNTAX_ERR:
            msg = 'SYNTAX_ERR';
            break;
        case FileError.PATH_EXISTS_ERR:
            msg = 'PATH_EXISTS_ERR';
            break;
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        }

        console.log('File Error: ' + msg);
	}

};
