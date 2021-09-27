// enemybuildings.js

// depot, office, factory
// not a threat, not animated
// just here to be blown up!

buildingsClass.prototype = new moveDrawClass();

function buildingsClass(startX,startY,whichKind) {
    const buildingW = 32;
    const buildingH = 32;
    this.myKind = whichKind;
	this.x = startX;
	this.origY = startY;
	this.y = 0;
	this.frame = 0;
	this.bombLockedOn = false;
	this.collW = buildingW;
    this.collH = buildingH;
    
    switch(this.myKind) {
        case GROUND_KIND_DEPOT:
            this.imgname = "depot";
            break;
        case GROUND_KIND_OFFICE:
            this.imgname = "office";
            break;
        case GROUND_KIND_FACTORY:
            this.imgname = "factory";
            break;
    }

    this.draw = function() {
		this.y = this.origY-bgDrawY;
        drawAnimFrame(this.imgname,this.x,this.y,this.frame,buildingW,buildingH);
	}

	this.move = function() {
        if(this.y > GAME_H + PIXEL_MARGIN_FOR_REMOVING) {
			this.readyToRemove = true;
		}
	}

	this.animate = function() {
	}
}
