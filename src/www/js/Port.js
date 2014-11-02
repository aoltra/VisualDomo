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
        fontSizeIcon = 85;
    var BASICA = 0,
        BASICD = 1,
        LAMP = 2,
        TEMPERATURE = 3;
    
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
    this.heightI = this.heightT = 10;
    
    if (this.type === 'D' && this.funct === "") {
        this.funct = BASICD;
    }
    
    if (this.type === 'A' && this.funct === "") {
        this.funct = BASICA;
    }
    
   /* if (this.type === 'A') {
        this.height = this.width;
        this.lineWidth = 8;
    } else {
        this.lineWidth = 4;
        this.width = 18;
    }*/
    
    Port.prototype.draw = function (ctx) {
  
        var radius, widthIcon, widthText, heightIcon, heightText;
        
      //  ctx.beginPath();
    //    ctx.lineWidth = this.lineWidth;
          
      /*  switch (this.type) {
        case 'D':   
            radius = 4;
            ctx.strokeStyle = '#00a354';   
            helpDraw.roundRect(ctx, this.posX - this.width, this.posY - this.height, 2 * this.width, 2 * this.height, radius, false, false);
            break;
        
        case 'A':
            ctx.strokeStyle = '#00a354';
          //  this.height = this.width;
        //    ctx.arc(this.posX, this.posY, 2 * this.width, 0.66 * Math.PI, 0.33 * Math.PI, false);
            ctx.font = "bold " + fontSize +"px VisualDomo";
            ctx.fillText("j",this.posX,this.posY);
            break;
        }*/
        console.log("DIGITAAAAALLLL " + this.funct + "<<");
        switch (this.funct) {
            case BASICD: 
                ctx.font = fontSizeIcon +"px VisualDomo";
                if (this.value === "ON") {
                    widthIcon = ctx.measureText("k").width;
                    ctx.fillText("k", this.posX - widthIcon * 0.5, this.posY);
                } else {
                    widthIcon = ctx.measureText("j").width;
                    ctx.fillText("j", this.posX - widthIcon * 0.5, this.posY);   
                }   
                break;
                
             case BASICA:
                ctx.font = fontSizeIcon +"px VisualDomo";
                widthIcon = ctx.measureText("a").width;
                ctx.fillText("a", this.posX - widthIcon * 0.5, this.posY);  
             
                break;
        
        
        }
        
        ctx.font = "bold " + fontSize +"px Arial";
        widthText = ctx.measureText(this.name).width;
        ctx.fillText(this.name, this.posX - widthText * 0.5, this.posY + fontSize + 3 );
        
        this.width = widthIcon;
        this.heightI = fontSizeIcon;
        this.heightT = fontSize;
    
        
//        ctx.stroke();
//        
//        ctx.beginPath();
//        ctx.lineWidth = 4;
//        ctx.moveTo(this.posX - this.width, this.posY - this.height);
//        ctx.lineTo(this.posX + this.width, this.posY + this.height);
//        ctx.moveTo(this.posX - this.width, this.posY + this.height);
//        ctx.lineTo(this.posX + this.width, this.posY - this.height);
//        ctx.stroke();
        
        // ctx.fillStyle = "blue";
       
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
         //   console.log("SALFO X!! " + this.name + " " + clickX + " " + this.posX + " "  + this.width);
            return false;
        }
        if (clickY > (this.posY + this.heightT) ||  clickY < (this.posY - this.heightI)) {
       //         console.log("SALFO Y!!" + this.name + " " + clickY + " " + this.posY + " "  + this.height + " "  + (this.posY + this.height));
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
    };
    

}