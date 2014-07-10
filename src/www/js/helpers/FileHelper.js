/*
 * Author: 				Alfredo Oltra
 * email: 				aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:   		10/7/2014
 *
 * Funciones de ayuda al manejo de sistema de archivos
 *
 * Helper functions to handle file system
 */

var helpFile = {

	// Allow create recursive directories
	// Based on the file tutorial from html5rocks.com 
	createDirectories: function(root, folders) {
		
		if (folders[0] == '.' || folders[0] == '') {
		    folders = folders.slice(1);
		}
		
		root.getDirectory(folders[0], {create: true, exclusive: false}, 
			function(dirEntry) {
		    	
		    	if (folders.length - 1) {
		      		helpFile.createDirectories(dirEntry, folders.slice(1));
		    	}

		    	console.log('Directory ' + dirEntry + ' created');
			}, 
			helpFile.errorHandler
		);

	},

	// handles a File system error
	errorHandler: function(e) {
	  	var msg = '';

	  	switch (e.code) {
		    case FileError.QUOTA_EXCEEDED_ERR:
		 	     msg = 'QUOTA_EXCEEDED_ERR';
		    	  break;
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
	  	};

	  	console.log('File Error: ' + msg);
	}

};
