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
/*global helpDraw */

// Constructor
function Port(name, type, input, funct) {
    "use strict";
    
    var fontSize = 16;
    
    this.name = name;
    this.type = type;
    this.input = input;
    this.funct = funct;
    
    this.level = -1;
    this.posX = -1000;
    this.posY = -1000;
    
    this.placed = false;
    
    this.value = 0;
    this.max = 0;       // only analog ports
    this.min = 100;     // only analog ports
    
    this.stateOff = ""; // only digital ports
    this.stateOn = "";  // only digital ports
    
    this.width = 10;
    this.height = 10;
    
    
    if (this.type === 'A') {
        this.height = this.width;
        this.lineWidth = 8;
    } else {
        this.lineWidth = 4;
        this.width = 18;
    }
    
    Port.prototype.draw = function (ctx) {
  
        var radius;
        
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        
        switch (this.type) {
        case 'D':   
            radius = 4;
            ctx.strokeStyle = '#00a354';   
            helpDraw.roundRect(ctx, this.posX - this.width, this.posY - this.height, 2 * this.width, 2 * this.height, radius, false, false);
            break;
        
        case 'A':
            ctx.strokeStyle = '#00a354';
            this.height = this.width;
            ctx.arc(this.posX, this.posY, 2 * this.width, 0.66 * Math.PI, 0.33 * Math.PI, false);
            break;
        }
        
        ctx.stroke();
        
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.moveTo(this.posX - this.width, this.posY - this.height);
        ctx.lineTo(this.posX + this.width, this.posY + this.height);
        ctx.moveTo(this.posX - this.width, this.posY + this.height);
        ctx.lineTo(this.posX + this.width, this.posY - this.height);
        ctx.stroke();
        
        // ctx.fillStyle = "blue";
        ctx.font = "bold " + fontSize +"px Arial";
        ctx.fillText(this.name, this.posX - this.width, this.posY + this.height + fontSize + 3);
    };
    
    Port.prototype.detectHit = function (clickX, clickY) {
    
        if (Math.abs(clickX - (this.posX - this.width - this.lineWidth))  > 2 * (this.width + this.lineWidth)) {
            console.log("SALFO X!! " + this.name + " " + clickX + " " + this.posX + " "  + this.width);
            return false;
        }
        if (Math.abs(clickY - (this.posY - this.height - this.lineWidth)) > 2 * (this.height + this.lineWidth)) {
                console.log("SALFO Y!!" + this.name + " " + clickY + " " + this.posY + " "  + this.height + " "  + (this.posY - this.height));
            return false;
        }
        
        console.log("lo tengoª!!  " + clickX + " " + clickY + " " + this.posX + " "  + this.posY + " " + this.height + " "  +(this.posY - this.height) +  "  " + (clickY - (this.posY - this.height)));
        
        this.posX = clickX;
        this.posY = clickY;
        return true;
    };
    
    Port.prototype.create = function (data) { 
        
        this.name = data.name;
        this.type = data.type;
        this.input = data.input;
        this.funct = data.funct;

        this.level = data.level;
        this.posX = data.posX;
        this.posY = data.posY;
    
        this.placed = data.placed;
    
        this.width = data.width;
        this.height = data.height;
    };
}