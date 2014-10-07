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
  
}