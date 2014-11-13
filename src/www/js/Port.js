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
    
    var fontSize = 16,
        fontSizeIcon = 85,
        fontSizeUnit = 24;
    var BASICA = 0,
        BASICD = 1,
        LAMP = 2,
        TEMPERATURE = 3,
        BLINDS = 4,
        AUDIO = 5;
    
    this.name = name;
    this.type = type;
    this.input = input;
    this.funct = funct;
    
    this.units = "";
    
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
    
    Port.prototype.draw = function (ctx) {
  
        var widthIcon, widthText, heightIcon, heightText;
        
        ctx.font = fontSizeIcon + "px VisualDomo";
        console.log("DIGITAAAAALLLL " + this.funct + "<<" + this.name);
        
        if (this.funct === 1)
        {
            if (this.value === "ON") {
                widthIcon = ctx.measureText("k").width;
                ctx.fillText("k", this.posX - widthIcon * 0.5, this.posY);
            } else {
                widthIcon = ctx.measureText("j").width;
                ctx.fillText("j", this.posX - widthIcon * 0.5, this.posY);   
            }   
        }
        else {
            widthIcon = ctx.measureText(app.functionPortsFonts[this.funct]).width;
            ctx.fillText(app.functionPortsFonts[this.funct], this.posX - widthIcon * 0.5, this.posY);
        }
        
         
        // Draw Units
        if (this.type == 'A') {
        
            var text = parseFloat(this.value).toPrecision() + " " + this.units;
            console.log("textoooooo "+ text);
            ctx.font = "bold " + fontSizeUnit +"px Arial";
            ctx.fillText(text, this.posX + widthIcon * 0.6, this.posY - fontSizeUnit * 0.5);
            
        }
//        switch (this.funct) {
//            case 0:
//                widthIcon = ctx.measureText("a").width;
//                ctx.fillText("a", this.posX - widthIcon * 0.5, this.posY);  
//                break;
//                
//            case 1:
//                if (this.value === "ON") {
//                    widthIcon = ctx.measureText("k").width;
//                    ctx.fillText("k", this.posX - widthIcon * 0.5, this.posY);
//                } else {
//                    widthIcon = ctx.measureText("j").width;
//                    ctx.fillText("j", this.posX - widthIcon * 0.5, this.posY);   
//                }   
//                break;
//        
//            case 2:
//                widthIcon = ctx.measureText("z").width;
//                ctx.fillText("z", this.posX - widthIcon * 0.5, this.posY);  
//                break;
//                
//            case 3:
//                 console.log("DIGITAAAAALLLL " + this.funct + "<<>>");
//                widthIcon = ctx.measureText("s").width;
//                ctx.fillText("s", this.posX - widthIcon * 0.5, this.posY);
//                 console.log("DIGITAAAAALLLL " + this.funct + "<<>><<>>");
//                break;
//                
//            case 4:
//                widthIcon = ctx.measureText("r").width;
//                ctx.fillText("r", this.posX - widthIcon * 0.5, this.posY);  
//                break;
//                
//            case 5:
//                 console.log("DIGITAAAAALLLL " + this.funct + "<<>>");
//                widthIcon = ctx.measureText("t").width;
//                ctx.fillText("t", this.posX - widthIcon * 0.5, this.posY);  
//                break;
//        
//        }
        
        ctx.font = "bold " + fontSize +"px Arial";
        widthText = ctx.measureText(this.name).width;
        ctx.fillText(this.name, this.posX - widthText * 0.5, this.posY + fontSize + 3 );
        
        this.width = widthIcon;
        this.heightI = fontSizeIcon;
        this.heightT = fontSize;
    
    };
    
    Port.prototype.detectHit = function (clickX, clickY, move) {
    
     /*   if (Math.abs(clickX - (this.posX - this.width - this.lineWidth))  > 2 * (this.width + this.lineWidth)) {
            console.log("SALFO X!! " + this.name + " " + clickX + " " + this.posX + " "  + this.width);
            return false;
        }
        if (Math.abs(clickY - (this.posY - this.height - this.lineWidth)) > 2 * (this.height + this.lineWidth)) {
                console.log("SALFO Y!!" + this.name + " " + clickY + " " + this.posY + " "  + this.height + " "  + (this.posY - this.height));
            return false;
        }*/
        
        if (clickX < this.posX - this.width * 0.6 ||  clickX > (this.posX + this.width * 0.6)) {
            console.log("SALFO X!! " + this.name + " " + clickX + " " + this.posX + " "  + this.width);
            return false;
        }
        if (clickY > (this.posY + this.heightT + 3) ||  clickY < (this.posY - this.heightI)) {
                console.log("SALFO Y!!" + this.name + " " + clickY + " " + this.posY + " "  + this.height + " "  + (this.posY + this.height));
            return false;
        }
        
     //   console.log("lo tengoª!!  " + clickX + " " + clickY + " " + this.posX + " "  + this.posY + " " + this.height + " "  +(this.posY - this.height) +  "  " + (clickY - (this.posY - this.height)));
        
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
    };
    
    Port.prototype.icon = function () {
        return app.functionPortsFonts[this.funct];
    };


}