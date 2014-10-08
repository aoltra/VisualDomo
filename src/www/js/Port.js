/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          5/10/2014
 *
 * Encapsula un puerto
 *
 * port encapsulation.
 */

/* JSLint options */
/*global helpFile,  LocalFileSystem */

// Constructor
function Port(name, type, funct) {
    "use strict";
    
    this.name = name;
    this.type = type;
    this.funct = funct;
    
    this.level = -1;
    this.posX = -1;
    this.posY = -1;
    
    this.placed = false;
    
    this.value = 0;
    this.max = 0;       // only analog ports
    this.min = 100;     // only analog ports
    
    this.stateOff = ""; // only digital ports
    this.stateOn = "";  // only digital ports
    
    Port.prototype.save = function () {
  
        switch (this.type) {
        
                case 0:
                
                    
                    break;
        
        
        
        
        }
        
    };
}