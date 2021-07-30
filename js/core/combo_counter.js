// a simple little "consecutive hits" combo counter just for fun
// provides an alternate optional reward system for accuracy

// how to use:
// player.combo = new comboCounter();
// player.combo.add(); // register a successful hit
// player.combo.reset(); // miss (bullet flies off screen)
// player.combo.current(); // returns current combo
// player.combo.draw(x,y); // renders gui somewhere

function comboCounter() {
    console.log("combo counter initializing");
    const kudos = ['NICE','SWEET','EXCELLENT','AMAZING','AWESOME','INCREDIBLE','FANTASTIC','EPIC','LEGENDARY','GALACTIC','INTERGALACTIC','ULTRA SKILL'];
    var _count = 0; // private
    this.current = function() { return _count; };
    this.add = function() { 
        _count++;
        console.log(_count+"x combo! nice.");
    };
    this.reset = function() {
        console.log("shot missed. combo reset to x0 (noooo!)");
        _count=0; 
    };
    this.draw = function(x=210,y=8) {
        //console.log("combo "+_count);
        if (_count>0) {
            context.font = "8px Helvetica";
            context.fillStyle = "black";
            context.fillText(_count+"x COMBO", x+1, y+1);
            context.fillStyle = "orange";
            context.fillText(_count+"x COMBO", x, y);
            if (_count > 9) { // say something cute
                var whichone = Math.min(Math.floor(_count/10),kudos.length-1);
                var wobble = Math.sin(performance.now()/1000)*8;
                context.fillText(kudos[whichone],x+wobble,y+9);
            }
            context.fillStyle = 'white';
        }
    }
}