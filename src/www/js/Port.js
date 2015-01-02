/* 
 *    This file is part of VisualDomo.

 *    VisualDomo is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.

 *    VisualDomo is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with VisualDomo.  If not, see <http://www.gnu.org/licenses/>.
 */

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
/*global helpDraw, app */

// Constructor
function Port(name, type, input, funct) {
    "use strict";
    
    var fontSize = 16,
        fontSizeIcon = 85,
        fontSizeUnit = 24,
        BASICA = 0,
        BASICD = 1,
        LAMP = 2,
        TEMPERATURE = 3,
        BLINDS = 4,
        AUDIO = 5,
        UNKNOW = 6;
    
    this.name = name;
    this.type = type;
    this.input = input;
    this.funct = funct;
    
    this.units = "";
    this.factor = 1;
    
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
    this.heightI = this.heightT = 10;
    
    if (this.type === 'D' && this.funct === "") {
        this.funct = BASICD;
    }
    
    if (this.type === 'A' && this.funct === "") {
        this.funct = BASICA;
    }
    
    if (this.type !== 'A' && this.type !== 'D' && this.funct === "") {
        this.funct = UNKNOW;
    }
    
    Port.prototype.draw = function (ctx) {
  
        var widthIcon, widthText, heightIcon, heightText, gradient, gradientPoint, text;
        
        ctx.font = fontSizeIcon + "px VisualDomo";
        
        if (this.funct === 1) {
            if (this.value === "ON") {
                widthIcon = ctx.measureText("k").width;
                ctx.fillStyle = '#ccdbba';
                ctx.fillText("k", this.posX - widthIcon * 0.5, this.posY);
            } else {
                widthIcon = ctx.measureText("j").width;
                ctx.fillStyle = '#e0828a';
                ctx.fillText("j", this.posX - widthIcon * 0.5, this.posY);
            }
        } else if (this.type === 'D') {
            if (this.value === "ON") {
                ctx.fillStyle = '#ccdbba';
            } else {
                ctx.fillStyle = '#e0828a';
            }
            
            widthIcon = ctx.measureText(app.functionPortsFonts[this.funct]).width;
            ctx.fillText(app.functionPortsFonts[this.funct], this.posX - widthIcon * 0.5, this.posY);
        } else {
            widthIcon = ctx.measureText(app.functionPortsFonts[this.funct]).width;
           
            
            gradient = ctx.createLinearGradient(this.posX - widthIcon * 0.5, this.posY, this.posX + widthIcon * 0.5, this.posY);
            
            if (this.max === this.min || this.max === undefined || this.min === undefined) {
                gradientPoint = 0.5;
            } else {
                gradientPoint = this.value / (this.max - this.min);
            }
            
            gradient.addColorStop(0, "#ccdbba");
            gradient.addColorStop(gradientPoint, "#ccdbba");
            gradient.addColorStop(gradientPoint + 0.01, "#e0828a");
            gradient.addColorStop(1, "#e0828a");
            
            //ctx.fillStyle = '#e0828a';
            ctx.fillStyle = gradient;
            
            ctx.fillText(app.functionPortsFonts[this.funct], this.posX - widthIcon * 0.5, this.posY);
        }
        
        // Draw Units
        if (this.type === 'A') {
        
            text = Math.round(parseFloat(this.value * this.factor)).toFixed(1) + " " + this.units;
     
            ctx.font = "bold " + fontSizeUnit + "px Arial";
            ctx.fillStyle = '#e0828a';
            ctx.fillText(text, this.posX + widthIcon * 0.6, this.posY - fontSizeUnit * 0.5);
            
        }
        
        ctx.font = "bold " + fontSize + "px Arial";
        widthText = ctx.measureText(this.name).width;
        ctx.fillText(this.name, this.posX - widthText * 0.5, this.posY + fontSize + 3);
        
        this.width = widthIcon;
        this.heightI = fontSizeIcon;
        this.heightT = fontSize;
    
    };
    
    Port.prototype.detectHit = function (clickX, clickY, move) {

        if (clickX < this.posX - this.width * 0.6 ||  clickX > (this.posX + this.width * 0.6)) {
            return false;
        }
        if (clickY > (this.posY + this.heightT + 3) ||  clickY < (this.posY - this.heightI)) {
            return false;
        }
        
        if (move) {
            this.posX = clickX;
            this.posY = clickY;
        }
        
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
        this.heightT = data.heightT;
        this.heightI = data.heightI;
        
        this.max = data.max;
        this.min = data.min;
        
        this.value = data.value;
        
        this.units = data.units;
        this.factor = data.factor;
        
        // new types
        if (this.type !== 'A' && this.type !== 'D' && this.funct === "") {
            this.funct = UNKNOW;
        }
    };
    
    Port.prototype.icon = function () {
        return app.functionPortsFonts[this.funct];
    };


}