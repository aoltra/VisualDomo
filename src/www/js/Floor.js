/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          5/9/2014
 *
 * Encapsula una planta
 *
 * floor encapsulation.
 */

/* JSLint options */
/*global helpFile,  LocalFileSystem */

// Constructor
function Floor(level, name, description, URL, inv) {
    "use strict";
    
    this.level = level;
    this.name = name;
    this.description = description;
    this.URL = URL;
    this.inv = inv;
}