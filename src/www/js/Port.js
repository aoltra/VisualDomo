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
function Port(name, type, input, funct) {
    "use strict";
    
    this.name = name;
    this.type = type;
    this.input = input;
    this.funct = funct;
    
    this.level = -1;
    this.posX = -1;
    this.posY = -1;
    
    this.ancho = 10;
    
    this.placed = false;
    
    this.value = 0;
    this.max = 0;       // only analog ports
    this.min = 100;     // only analog ports
    
    this.stateOff = ""; // only digital ports
    this.stateOn = "";  // only digital ports
    
    if (this.type === 'A') {
        this.alto = this.ancho;
    }
    
    Port.prototype.draw = function (ctx) {
  
        ctx.beginPath();

        switch (this.type) {
        case 'D':
                
                    
            break;
        
        case 'A':
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#00cc00';
            this.alto = this.ancho;
            ctx.arc(this.posX, this.posY, 2 * this.ancho, 0.66 * Math.PI, 0.33 * Math.PI, false);
            break;
        }
        
        ctx.stroke();
        
    };
    
    Port.prototype.detectHit = function (clickX, clickY) {
    
        if (clickX - (this.posX - this.ancho)  > this.ancho) {
            return false;
        }
        if (clickY - (this.posX - this.alto) > this.alto) {
            return false;
        }
        
        console.log("lo tengoª!!");
        
        this.posX = clickX;
        this.posY = clickY;
        return true;
    };
}