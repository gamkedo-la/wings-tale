// score gui

// how to use:
// player.scoreUI = new score_gui();
// player.scoreUI.draw(value,x,y);

const TRACK_HIGHSCORE = true; // uses localstorage

function score_gui() {
    var currentValue = 0; // target value
    var displayedValue = 0; // what is on screen
    var scoreString = ""; // padded with zeroes
    const animStep = 1; // how much we count up by
    const maxSteps = 100; // avoid falling too far behind
    var highscore = 0;

    if (TRACK_HIGHSCORE) { // initialize
        //console.log("Loading highscore from localstorage.");
        try { highscore = localStorage.getItem('WINGS_TALE_HIGHSCORE'); }
        catch(e) {}; // ignore errors
        if (!highscore) highscore = 0; // turns null/undefined into zero
    }

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

        if (TRACK_HIGHSCORE) {
            
            // save highscore if we just beat it
            // fixme: runs every new hit if we're doing well
            if (currentValue > highscore) {
                highscore = currentValue; 
                //console.log("Saving new highscore to localstorage: " + highscore);
                try { localStorage.setItem('WINGS_TALE_HIGHSCORE',highscore); }
                catch(e) {}; // ignore errors
            }
            // draw high score
            micro_pixel_font("HIGH SCORE",108,8);
            micro_pixel_font(String(highscore).padStart(6, "0"),116,16);
        }

    }
}