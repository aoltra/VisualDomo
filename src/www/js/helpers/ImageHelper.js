/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          5/9/2014
 *
 * Funciones de ayuda al manejo de imagenes
 *
 * Helper functions for processing images
 */

var helpImage = {

     /* http://www.html5canvastutorials.com/advanced/html5-canvas-invert-image-colors-tutorial */
    invertColor: function (context, x, y, imageObj) {
        "use strict";
        
        var imageData = context.getImageData(x, y, imageObj.width, imageObj.height),
            data = imageData.data,
            i;

        for (i = 0; i < data.length; i += 4) {
            // red
            data[i] = 255 - data[i];
            // green
            data[i + 1] = 255 - data[i + 1];
            // blue
            data[i + 2] = 255 - data[i + 2];
        }

        // overwrite original image
        context.putImageData(imageData, x, y);
    }
    
};