// score gui

// how to use:
// player.scoreUI = new score_gui();
// player.scoreUI.draw(value,x,y);

function score_gui() {
    var currentValue = 0; // target value
    var displayedValue = 0; // what is on screen
    var scoreString = ""; // padded with zeroes
    const animStep = 1; // how much we count up by
    const maxSteps = 100; // avoid falling too far behind

    this.draw = function(value=0,x=0,y=0) {
        //console.log("score "+value);
        currentValue = value; // set target score
        if (displayedValue < currentValue) { 
            displayedValue += animStep; // animate
            if (currentValue - displayedValue > maxSteps) {
                displayedValue += maxSteps; // faster
            }
        }
        scoreString = String(displayedValue).padStart(6, "0");
        micro_pixel_font("SCORE: "+scoreString, x, y);
    }
}