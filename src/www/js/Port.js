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
    this.posX = -1000;
    this.posY = -1000;
    
    this.ancho = 10;
    this.alto = 10;
    
    this.placed = false;
    
    this.value = 0;
    this.max = 0;       // only analog ports
    this.min = 100;     // only analog ports
    
    this.lineWidth = 8;
    
    this.stateOff = ""; // only digital ports
    this.stateOn = "";  // only digital ports
    
    if (this.type === 'A') {
        this.alto = this.ancho;
        this.lineWidth = 8;
    }
    
    Port.prototype.draw = function (ctx) {
  
        ctx.beginPath();

        switch (this.type) {
        case 'D':
                
                    
            break;
        
        case 'A':
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = '#00a354';
            this.alto = this.ancho;
            ctx.arc(this.posX, this.posY, 2 * this.ancho, 0.66 * Math.PI, 0.33 * Math.PI, false);
            break;
        }
        
        ctx.stroke();
        
        
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.moveTo(this.posX-this.ancho,this.posY-this.alto);
        ctx.lineTo(this.posX+this.ancho,this.posY+this.alto);
         ctx.moveTo(this.posX-this.ancho,this.posY+this.alto);
        ctx.lineTo(this.posX+this.ancho,this.posY-this.alto);
        ctx.stroke();
        
        // ctx.fillStyle = "blue";
        ctx.font = "bold 16px Arial";
        ctx.fillText(this.name, this.posX - this.ancho, this.posY + this.alto + this.fuente + 3);
    };
    
    Port.prototype.detectHit = function (clickX, clickY) {
    
        if (Math.abs(clickX - (this.posX - this.ancho - this.lineWidth))  > 2 * (this.ancho + this.lineWidth)) {
            console.log("SALFO X!! " + this.name + " " + clickX + " " + this.posX + " "  + this.ancho);
            return false;
        }
        if ( Math.abs(clickY - (this.posY - this.alto))> 2 * (this.alto + this.lineWidth)) {
                console.log("SALFO Y!!" + this.name + " " + clickY + " " + this.posY + " "  + this.alto + " "  + (this.posY - this.alto));
            return false;
        }
        
        console.log("lo tengoª!!  " + clickX + " " + clickY + " " + this.posX + " "  + this.posY + " " + this.alto + " "  +(this.posY - this.alto) +  "  " + (clickY - (this.posY - this.alto)));
        
        this.posX = clickX; //- this.ancho;
        this.posY = clickY;// - this.alto;
        return true;
    };
}